/**
 * @summary
 * Updates an existing task with validation for all fields and business rules.
 * Validates task existence, ownership, and field constraints.
 *
 * @procedure spTaskUpdate
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - PUT /api/v1/internal/task/:id
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy
 *
 * @param {INT} idUser
 *   - Required: Yes
 *   - Description: User identifier for ownership validation
 *
 * @param {INT} idTask
 *   - Required: Yes
 *   - Description: Task identifier to update
 *
 * @param {NVARCHAR(100)} title
 *   - Required: Yes
 *   - Description: Updated task title
 *
 * @param {NVARCHAR(500)} description
 *   - Required: No
 *   - Description: Updated task description
 *
 * @param {TINYINT} priority
 *   - Required: Yes
 *   - Description: Updated task priority
 *
 * @param {DATE} dueDate
 *   - Required: No
 *   - Description: Updated task due date
 *
 * @param {TINYINT} status
 *   - Required: Yes
 *   - Description: Updated task status
 *
 * @returns {INT} idTask - Updated task identifier
 *
 * @testScenarios
 * - Valid update with all parameters
 * - Valid update with partial parameters
 * - Task not found
 * - Duplicate title validation
 * - Invalid field values
 * - Past due date validation
 */
CREATE OR ALTER PROCEDURE [functional].[spTaskUpdate]
  @idAccount INTEGER,
  @idUser INTEGER,
  @idTask INTEGER,
  @title NVARCHAR(100),
  @description NVARCHAR(500) = '',
  @priority TINYINT,
  @dueDate DATE = NULL,
  @status TINYINT
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @validation Required parameter validation
   * @throw {titleRequired}
   */
  IF (@title IS NULL OR LTRIM(RTRIM(@title)) = '')
  BEGIN
    ;THROW 51000, 'titleRequired', 1;
  END;

  /**
   * @validation Title length validation
   * @throw {titleExceedsMaxLength}
   */
  IF (LEN(@title) > 100)
  BEGIN
    ;THROW 51000, 'titleExceedsMaxLength', 1;
  END;

  /**
   * @validation Description length validation
   * @throw {descriptionExceedsMaxLength}
   */
  IF (@description IS NOT NULL AND LEN(@description) > 500)
  BEGIN
    ;THROW 51000, 'descriptionExceedsMaxLength', 1;
  END;

  /**
   * @validation Priority value validation
   * @throw {invalidPriority}
   */
  IF (@priority NOT BETWEEN 0 AND 2)
  BEGIN
    ;THROW 51000, 'invalidPriority', 1;
  END;

  /**
   * @validation Status value validation
   * @throw {invalidStatus}
   */
  IF (@status NOT BETWEEN 0 AND 1)
  BEGIN
    ;THROW 51000, 'invalidStatus', 1;
  END;

  /**
   * @validation Due date validation
   * @throw {dueDateInPast}
   */
  IF (@dueDate IS NOT NULL AND @dueDate < CAST(GETUTCDATE() AS DATE))
  BEGIN
    ;THROW 51000, 'dueDateInPast', 1;
  END;

  /**
   * @validation Account existence validation
   * @throw {accountDoesntExist}
   */
  IF NOT EXISTS (SELECT * FROM [subscription].[account] acc WHERE acc.[idAccount] = @idAccount)
  BEGIN
    ;THROW 51000, 'accountDoesntExist', 1;
  END;

  /**
   * @validation User existence and account association validation
   * @throw {userDoesntExist}
   */
  IF NOT EXISTS (SELECT * FROM [security].[user] usr WHERE usr.[idUser] = @idUser AND usr.[idAccount] = @idAccount)
  BEGIN
    ;THROW 51000, 'userDoesntExist', 1;
  END;

  /**
   * @validation Task existence and ownership validation
   * @throw {taskDoesntExist}
   */
  IF NOT EXISTS (
    SELECT * 
    FROM [functional].[task] tsk 
    WHERE tsk.[idTask] = @idTask 
      AND tsk.[idAccount] = @idAccount 
      AND tsk.[idUser] = @idUser 
      AND tsk.[deleted] = 0
  )
  BEGIN
    ;THROW 51000, 'taskDoesntExist', 1;
  END;

  /**
   * @validation Title uniqueness validation (excluding current task)
   * @throw {titleAlreadyExists}
   */
  IF EXISTS (
    SELECT * 
    FROM [functional].[task] tsk 
    WHERE tsk.[idAccount] = @idAccount 
      AND tsk.[idUser] = @idUser 
      AND tsk.[title] = @title 
      AND tsk.[idTask] <> @idTask 
      AND tsk.[deleted] = 0
  )
  BEGIN
    ;THROW 51000, 'titleAlreadyExists', 1;
  END;

  BEGIN TRY
    /**
     * @rule {db-multi-tenancy-pattern,fn-task-update} Update task with account isolation
     */
    BEGIN TRAN;

      UPDATE [functional].[task]
      SET
        [title] = @title,
        [description] = @description,
        [priority] = @priority,
        [dueDate] = @dueDate,
        [status] = @status,
        [dateModified] = GETUTCDATE()
      WHERE [idTask] = @idTask
        AND [idAccount] = @idAccount
        AND [idUser] = @idUser
        AND [deleted] = 0;

      /**
       * @output {TaskUpdated, 1, 1}
       * @column {INT} idTask - Updated task identifier
       */
      SELECT @idTask AS [idTask];

    COMMIT TRAN;
  END TRY
  BEGIN CATCH
    ROLLBACK TRAN;
    THROW;
  END CATCH;
END;
GO
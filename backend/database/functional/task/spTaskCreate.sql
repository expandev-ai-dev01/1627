/**
 * @summary
 * Creates a new task with validation for required fields and business rules.
 * Validates title uniqueness per user, priority values, and due date constraints.
 *
 * @procedure spTaskCreate
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - POST /api/v1/internal/task
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy
 *
 * @param {INT} idUser
 *   - Required: Yes
 *   - Description: User identifier who is creating the task
 *
 * @param {NVARCHAR(100)} title
 *   - Required: Yes
 *   - Description: Task title (max 100 characters)
 *
 * @param {NVARCHAR(500)} description
 *   - Required: No
 *   - Description: Task description (max 500 characters, defaults to empty string)
 *
 * @param {TINYINT} priority
 *   - Required: Yes
 *   - Description: Task priority (0=Low, 1=Medium, 2=High, defaults to 1)
 *
 * @param {DATE} dueDate
 *   - Required: No
 *   - Description: Task due date (must be today or future date)
 *
 * @returns {INT} idTask - Created task identifier
 *
 * @testScenarios
 * - Valid creation with all parameters
 * - Valid creation with only required parameters
 * - Security validation failure with invalid account
 * - Duplicate title validation
 * - Invalid priority value
 * - Past due date validation
 */
CREATE OR ALTER PROCEDURE [functional].[spTaskCreate]
  @idAccount INTEGER,
  @idUser INTEGER,
  @title NVARCHAR(100),
  @description NVARCHAR(500) = '',
  @priority TINYINT = 1,
  @dueDate DATE = NULL
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
   * @validation Title uniqueness validation
   * @throw {titleAlreadyExists}
   */
  IF EXISTS (
    SELECT * 
    FROM [functional].[task] tsk 
    WHERE tsk.[idAccount] = @idAccount 
      AND tsk.[idUser] = @idUser 
      AND tsk.[title] = @title 
      AND tsk.[deleted] = 0
  )
  BEGIN
    ;THROW 51000, 'titleAlreadyExists', 1;
  END;

  BEGIN TRY
    /**
     * @rule {db-multi-tenancy-pattern,fn-task-creation} Create task with account isolation
     */
    BEGIN TRAN;

      DECLARE @idTask INTEGER;

      INSERT INTO [functional].[task] (
        [idAccount],
        [idUser],
        [title],
        [description],
        [priority],
        [dueDate],
        [status],
        [dateCreated],
        [dateModified]
      )
      VALUES (
        @idAccount,
        @idUser,
        @title,
        @description,
        @priority,
        @dueDate,
        0,
        GETUTCDATE(),
        GETUTCDATE()
      );

      SET @idTask = SCOPE_IDENTITY();

      /**
       * @output {TaskCreated, 1, 1}
       * @column {INT} idTask - Created task identifier
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
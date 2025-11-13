/**
 * @summary
 * Retrieves a specific task by ID with full details.
 * Validates task existence and user ownership.
 *
 * @procedure spTaskGet
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - GET /api/v1/internal/task/:id
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
 *   - Description: Task identifier to retrieve
 *
 * @returns Single task record with all details
 *
 * @testScenarios
 * - Valid task retrieval
 * - Task not found
 * - Task belongs to different user
 * - Deleted task access attempt
 */
CREATE OR ALTER PROCEDURE [functional].[spTaskGet]
  @idAccount INTEGER,
  @idUser INTEGER,
  @idTask INTEGER
AS
BEGIN
  SET NOCOUNT ON;

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
   * @rule {db-multi-tenancy-pattern,fn-task-retrieval} Retrieve task with account and user isolation
   */
  /**
   * @output {TaskDetails, 1, n}
   * @column {INT} idTask - Task identifier
   * @column {NVARCHAR(100)} title - Task title
   * @column {NVARCHAR(500)} description - Task description
   * @column {TINYINT} priority - Task priority (0=Low, 1=Medium, 2=High)
   * @column {DATE} dueDate - Task due date
   * @column {TINYINT} status - Task status (0=Pending, 1=Completed)
   * @column {DATETIME2} dateCreated - Task creation date
   * @column {DATETIME2} dateModified - Task last modification date
   */
  SELECT
    [tsk].[idTask],
    [tsk].[title],
    [tsk].[description],
    [tsk].[priority],
    [tsk].[dueDate],
    [tsk].[status],
    [tsk].[dateCreated],
    [tsk].[dateModified]
  FROM [functional].[task] [tsk]
  WHERE [tsk].[idTask] = @idTask
    AND [tsk].[idAccount] = @idAccount
    AND [tsk].[idUser] = @idUser
    AND [tsk].[deleted] = 0;
END;
GO
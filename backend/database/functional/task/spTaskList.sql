/**
 * @summary
 * Lists all active tasks for a specific user with filtering and sorting capabilities.
 * Returns task details including title, description, priority, due date, and status.
 *
 * @procedure spTaskList
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - GET /api/v1/internal/task
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy
 *
 * @param {INT} idUser
 *   - Required: Yes
 *   - Description: User identifier to filter tasks
 *
 * @param {TINYINT} status
 *   - Required: No
 *   - Description: Filter by status (0=Pending, 1=Completed, NULL=All)
 *
 * @param {TINYINT} priority
 *   - Required: No
 *   - Description: Filter by priority (0=Low, 1=Medium, 2=High, NULL=All)
 *
 * @returns Multiple task records with all task details
 *
 * @testScenarios
 * - List all tasks for user
 * - Filter by status
 * - Filter by priority
 * - Combined filters
 * - Empty result set
 */
CREATE OR ALTER PROCEDURE [functional].[spTaskList]
  @idAccount INTEGER,
  @idUser INTEGER,
  @status TINYINT = NULL,
  @priority TINYINT = NULL
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
   * @validation Status value validation
   * @throw {invalidStatus}
   */
  IF (@status IS NOT NULL AND @status NOT BETWEEN 0 AND 1)
  BEGIN
    ;THROW 51000, 'invalidStatus', 1;
  END;

  /**
   * @validation Priority value validation
   * @throw {invalidPriority}
   */
  IF (@priority IS NOT NULL AND @priority NOT BETWEEN 0 AND 2)
  BEGIN
    ;THROW 51000, 'invalidPriority', 1;
  END;

  /**
   * @rule {db-multi-tenancy-pattern,fn-task-listing} List tasks with account isolation and optional filters
   */
  /**
   * @output {TaskList, n, n}
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
  WHERE [tsk].[idAccount] = @idAccount
    AND [tsk].[idUser] = @idUser
    AND [tsk].[deleted] = 0
    AND ((@status IS NULL) OR ([tsk].[status] = @status))
    AND ((@priority IS NULL) OR ([tsk].[priority] = @priority))
  ORDER BY
    [tsk].[priority] DESC,
    [tsk].[dueDate] ASC,
    [tsk].[dateCreated] DESC;
END;
GO
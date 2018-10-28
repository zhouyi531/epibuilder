const sqlParser = require("../lib/sqlParser");

console.log(
  sqlParser.parseSQL(`
/*
executionMasks:
  jwt-role-glg: 17
glgjwtComment: 'Flag [17] includes = APP|USER'
*/
--parameters:
--@cmFlagRelationId int cmFlagRelationId
--@id int id
--@name varchar name

SET NOCOUNT ON;

UPDATE dbo.COUNCIL_MEMBER_FLAG_RELATION
  SET ACTIVE_IND = 0,
    LAST_UPDATED_BY = 0,  --System User
    LAST_UPDATE_DATE = SYSUTCDATETIME()
WHERE COUNCIL_MEMBER_FLAG_RELATION_ID = @cmFlagRelationId;
`)
);

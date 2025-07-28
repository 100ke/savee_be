module.exports = (sequelize, DataTypes) => {
  const AnalysisResult = sequelize.define(
    "AnalysisResult",
    {},
    { tableName: "analysis_results" }
  );
  return AnalysisResult;
};

const path = require("path");

// module.exports = path.dirname(process.mainModule.filename); // 레거시
module.exports = path.dirname(require.main.filename);

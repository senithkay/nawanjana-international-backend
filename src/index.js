"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var constants_1 = require("../utils/constants");
var app = (0, express_1.default)();
app.use(express_1.default.json());
app.get('/', function (req, res) {
    console.log('a');
});
app.listen(constants_1.PORT, function () {
    console.log("Server started on http://localhost:".concat(constants_1.PORT));
});

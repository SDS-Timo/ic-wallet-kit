"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPropertyName = void 0;
function getPropertyName(o, expression) {
    const res = {};
    Object.keys(o).map(k => res[k] = k);
    return expression(res);
}
exports.getPropertyName = getPropertyName;

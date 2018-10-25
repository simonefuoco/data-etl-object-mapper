const _ = require('lodash');

const fill = (args) => {
    let mapping = null;
    if (typeof args.mapping === "string") {
        mapping = JSON.parse(args.mapping);
    } else {
        mapping = args.mapping;
    }

    let target = {};

    for (const [originPath, targetPath] of Object.entries(mapping)) {
        if(originPath !== "@target_fields") {
            let originValue = _.cloneDeepWith(_.get(args.origin, originPath));
            _.setWith(target, targetPath, originValue);
        }
    }

    for (const [targetPath, targetValue] of Object.entries(mapping['@target_fields'])) {
        _.setWith(target, targetPath, targetValue);
    }

    return target;
};

/**
 * @typedef MapperArgument
 * @property {string|object} mapping - Plain object with origin path as key and target path as value.
 */

/**
 * Map data from one object to another base on mapping file.
 * @function map
 * @public
 * @param {MapperArgument} args - mapper arguments.
 */
module.exports.transform = function (args) {
    const {Transform} = require('stream');
    return new Transform({
        readableObjectMode: true,
        writeableObjectMode: true,
        transform(chunk, encoding, callback) {
            this.push(fill({
                mapping: args.mapping,
                origin: chunk
            }));
            callback();
        }
    });
}
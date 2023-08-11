/**
 * @author Mohit Verma
 * @description this file has method to validate L3 csv/xlsx rule engine
 */
const papa = require('papaparse');
const excelRules = require('./excelRule');
const utils = require('../utils/helpers');
const config = require('../config/index');

/**
 * @description Excel validation
 * @param {*} key key
 * @param {*} rulename Rule name
 */
exports.excelValiation = async (key, rulename) => {
	const bucketname = config.bucketPath;
	const fileData = await utils.getS3Stream(bucketname, key);
	return new Promise((resolve) => {
		let count = 2;
		const contener = [];
		papa.parse(fileData, {
			header: true,
			dynamicTyping: true,
			skipEmptyLines: false,
			worker: true,
			step: (result, parser) => {
				try {
					const fields = result.meta.fields.map((v) => v.trim());
					const ack = validator(
						fields,
						result.data,
						count,
						excelRules[rulename]
					);
					if (ack.error) {
						contener.push({ error: ack.data });
						throw ack.data;
					} else if (Object.keys(ack).length > 0) {
						contener.push(ack);
					}
					count++;
				} catch (e) {
					// eslint-disable-next-line no-undef
					parser.abort();
					// return { error:e+count };
					resolve({ error: e + count });
				}
			},
			complete: () => {
				const final = {};
				contener.forEach((v) => {
					for (const [key, value] of Object.entries(v)) {
						if (final[key] != undefined) {
							final[key] = final[key].concat(value);
						} else {
							final[key] = value;
						}
					}
				});
				resolve(final);
			},
		});
	});
};

/**
 * @description Colname
 * @param {number} n Col count
 */
const colName = (n) => {
	const ordA = 'a'.charCodeAt(0);
	const ordZ = 'z'.charCodeAt(0);
	const len = ordZ - ordA + 1;

	let s = '';
	while (n >= 0) {
		s = String.fromCharCode((n % len) + ordA) + s;
		n = Math.floor(n / len) - 1;
	}
	return s.toUpperCase();
};
/**
 * @description Range
 * @param {number} start start range
 * @param {number} end end range
 */
const range = (start, end) =>
	[...Array(end - start + 1)].map((_, i) => start + i);
/**
 * @description Convert letter to number
 * @param {object} letters Letters
 */
const convertLetterToNumber = (letters) => {
	let n = 0;
	for (let p = 0; p < letters.length; p++) {
		n = letters[p].charCodeAt() - 64 + n * 26;
	}
	return n - 1;
};
/**
 * @description Split Array
 * @param {object} data Data
 * @returns
 */
const splitArr = (data) => {
	let final;
	if (data.length > 1) {
		const between = data[1].split('-');
		if (between.length > 1) {
			final = [convertLetterToNumber(data[0])].concat(
				range(
					convertLetterToNumber(between[0]),
					convertLetterToNumber(between[1])
				)
			);
		} else {
			final = [convertLetterToNumber(data[0])].concat(
				convertLetterToNumber(data[1])
			);
		}
	} else {
		final = [convertLetterToNumber(data[0])];
	}
	return final;
};
/**
 * @description validator
 * @param {object} fields Fields
 * @param {object} data Data
 * @param {number} count Count
 * @param {number} rule Rule
 * @returns
 */

const validator = (fields, data, count, rule) => {
	const errorStore = {};
	try {
		if (
			Object.keys(fields).length != rule.columnCount &&
			Object.keys(data).length <= rule.columnCount
		)
			throw 'Number of column mismatch!';
		const output = fields.filter((obj) => {
			return rule.columnMatch.indexOf(obj) !== -1;
		});
		if (output.length !== rule.columnCount) throw 'Column name mismatch!';
		const dataVal = Object.values(data);

		if (rule.required != undefined) {
			const required = splitArr(rule.required);
			const resultRequired = [];
			required.forEach((v) => {
				if (dataVal[v] == null || dataVal[v] == undefined || dataVal[v] == '') {
					resultRequired.push(colName(v) + count + '-' + dataVal[v]);
				}
			});
			if (resultRequired.length > 0) {
				errorStore['Value required'] = resultRequired;
			}
		}

		if (rule.eNum != undefined) {
			const eNum = splitArr(rule.eNum.columns);
			const resultEnum = [];
			eNum.forEach((v) => {
				if (dataVal[v] != null) {
					if (!rule.eNum.values.includes(dataVal[v])) {
						resultEnum.push(colName(v) + count + '-' + dataVal[v]);
					}
				}
			});
			if (resultEnum.length > 0) {
				errorStore['Invalid value eNum'] = resultEnum;
			}
		}

		if (rule.dataType != undefined) {
			const resultDataType = [];
			for (const [key, value] of Object.entries(rule.dataType)) {
				const cell = splitArr(value);
				cell.forEach((v) => {
					if (typeof dataVal[v] != key) {
						resultDataType.push(colName(v) + count + '-' + dataVal[v]);
					}
				});
			}
			if (resultDataType.length > 0) {
				errorStore['Invalid dataType'] = resultDataType;
			}
		}

		if (rule.pattern != undefined) {
			const pattern = splitArr(rule.pattern.columns);
			const resultPattern = [];
			pattern.forEach((v) => {
				if (dataVal[v] != null) {
					const data = dataVal[v].split(',');
					data.forEach((value) => {
						if (!rule.pattern.regx.test(value)) {
							resultPattern.push(colName(v) + count + '-' + dataVal[v]);
						}
					});
				}
			});
			if (resultPattern.length > 0) {
				errorStore['Invalid value pattern'] = resultPattern;
			}
		}

		if (rule.compare != undefined) {
			const compare = splitArr(rule.compare.columns);
			const resultCompare = [];
			const valid = eval(
				dataVal[compare[0]] + rule.compare.condition + dataVal[compare[1]]
			);
			if (!valid) {
				resultCompare.push(
					colName(compare[0]) +
						count +
						'-' +
						dataVal[compare[0]] +
						' ' +
						rule.compare.condition +
						' ' +
						colName(compare[1]) +
						count +
						'-' +
						dataVal[compare[1]]
				);
			}
			if (resultCompare.length > 0) {
				errorStore['Invalid value compare'] = resultCompare;
			}
		}

		// return errorStore;
		return { error: false, data: errorStore };
	} catch (error) {
		return { error: true, data: error };
	}
};

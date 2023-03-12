/* eslint-disable @typescript-eslint/no-explicit-any */
// import { ObjectError } from "./type";

// export const objErr = (err: any, des = ""): ObjectError => {
// 	des !== "" && console.log(`\n${des}`);
// 	console.error("\nError message: ", err.message);
// 	return {
// 		status: false,
// 		isErr: true,
// 		errMsg: err.message,
// 		errCode: err.code || "",
// 		errRoutine: err.routine || "",
// 		err,
// 	};
// };

export const falseAndLog = (err: any, des: string[] = []): false => {
	if (des.length > 0)
		if (des[2]) console.log(`\n[${des[0]}] > ${des[1]} - ${des[2]}`);
		else console.log(`\n[${des[0]}] > ${des[1]}`);
	console.error(err);
	return false;
};

// export const isPropErr = (obj: any): boolean => "isErr" in obj && obj.isErr;

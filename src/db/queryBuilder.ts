const operators = {
  "=": " = ",
  "<=": " <= ",
  ">=": " >= ",
  "<": " < ",
  ">": " > ",
};

type operatorKeys = keyof typeof operators;

interface IQueryBuilder {
  table: string;
}

interface IQueryBuilderResponse {
  text: string;
  args?: any[];
}

export interface IQueryFilter {
  columns: string[];
  where: {
    [key: string]: {
      operator: operatorKeys;
      value: any;
    };
  };
}

const generateConditions = (
  where?: IQueryFilter["where"],
  startPlaceholderIndex = 1
): [string, any[]] => {
  let conditions = "";
  const values: any[] = [];
  if (where) {
    const conditionKeys = Object.keys(where);

    conditionKeys.forEach((key, index) => {
      const conditionVal = where[key];
      const operator = operators[conditionVal.operator];
      conditions += `${key}${operator}$${startPlaceholderIndex + index}${
        index === conditionKeys.length - 1 ? "" : " AND "
      }`;
      values.push(conditionVal?.value);
    });
  }

  return [conditions, values];
};

export const QueryBuilder = {
  build: {
    save: (table: string, data: StringMap): IQueryBuilderResponse => {
      const values = Object.values(data);
      const placeholders = values.map((_, idx) => `$${idx + 1}`).join(",");
      const keys = Object.keys(data).join(",");

      return {
        text: `INSERT INTO "${table}" (${keys}) VALUES (${placeholders})`,
        args: values,
      };
    },

    filter: ({
      table,
      columns,
      where,
    }: Partial<IQueryFilter> & IQueryBuilder): IQueryBuilderResponse => {
      // let conditions = "";
      // const values: any[] = [];

      const [conditions, values] = generateConditions(where);

      // if (where) {
      //     const conditionKeys = Object.keys(where);

      //     conditionKeys.forEach((key, index) => {
      //         const conditionVal = where[key];
      //         const operator = operators[conditionVal.operator];

      //         conditions += `${key} ${operator} $${index + 1}${
      //             index === conditionKeys.length - 1 ? "" : " AND "
      //         }`;

      //         values.push(conditionVal.value);
      //     });
      // }
      return {
        text: `SELECT ${columns ? columns.join() : "*"} FROM "${table}" ${
          conditions ? " WHERE " + conditions : ""
        }`,
        args: values,
      };
    },

    update: (
      table: string,
      data: StringMap,
      where: StringMap
    ): IQueryBuilderResponse => {
      // let conditions = "";
      let updater = "";
      let placeholderIndex = 1;
      // const values: any[] = [];

      if (data) {
        const dataKeys = Object.keys(data);
        dataKeys.forEach((key, index) => {
          updater += `${key} = $${placeholderIndex + index}`;

          values.push(data[key]);
        });
        placeholderIndex += dataKeys.length;
      }

      const [conditions, values] = generateConditions(where, placeholderIndex);

      // if (where) {
      //     const conditionKeys = Object.keys(where);
      //     conditionKeys.forEach((key, index) => {
      //         conditions += `${key} = $${placeholderIndex + index}${
      //             index === conditionKeys.length - 1 ? "" : " AND "
      //         }`;
      //         const conditionVal = where[key]?.value;
      //         values.push(
      //             typeof conditionVal === "string"
      //                 ? `'${conditionVal}'`
      //                 : conditionVal
      //         );
      //     });
      // }

      return {
        text: `UPDATE "${table}" SET ${updater}${
          conditions ? " WHERE " + conditions : ""
        }`,
        args: values,
      };
    },

    delete: (table: string, where: IQueryFilter["where"]) => {
      const [conditions, values] = generateConditions(where);
      return {
        text: `DELETE FROM "${table}" ${
          conditions ? " WHERE " + conditions : ""
        }`,
        args: values,
      };
    },
  },
};

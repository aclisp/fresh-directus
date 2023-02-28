import { useState } from "preact/hooks";

interface FormulaRunInput {
  expr: string;
  inputData: Record<string, unknown>;
}

interface FormulaRunResult {
  error: boolean;
  outputDataType: string;
  outputData: string;
}

const defaultInputData = {
  "CreateDate": "2023-03-03",
  "Discount": {
    "Rate": 0.5,
    "StartDate": "2023-03-01",
    "ValidMonth": 1,
  },
  "BuyingProduct": [
    { "Name": "粉", "Count": 1, "Price": 10 },
    { "Name": "粉", "Count": 2, "Price": 5 },
    { "Name": "粉", "Count": 1, "Price": 3 },
  ],
};

const defaultInputDataString = JSON.stringify(defaultInputData, null, 2);
const defaultExpr = `
#IF(@@CreateDate@@ > @@Discount.StartDate@@ AND
  @@CreateDate@@ < #ADDMONTH(@@Discount.StartDate@@, @@Discount.ValidMonth@@),
  @@BuyingProduct.Count@@ * @@BuyingProduct.Price@@ * @@Discount.Rate@@,
  @@BuyingProduct.Count@@ * @@BuyingProduct.Price@@
)
`;
const defaultFormulaRunResult: FormulaRunResult = {
  error: false,
  outputDataType: "",
  outputData: "",
};

export default function FormulaCalculator() {
  const [expr, setExpr] = useState(defaultExpr);
  const [inputData, setInputData] = useState(defaultInputDataString);
  const [result, setResult] = useState<FormulaRunResult>(
    defaultFormulaRunResult,
  );
  let inputError = "";
  let inputJson: Record<string, unknown> | undefined = undefined;

  try {
    inputJson = JSON.parse(inputData);
  } catch (error) {
    inputError = String(error);
  }

  return (
    <div class="flex gap-6 m-6">
      <div class="basis-1/3">
        <div class="mb-2">公式</div>
        <textarea
          class="font-mono w-full rounded-lg h-[20rem]"
          value={expr}
          onChange={(e) => setExpr(e.currentTarget.value)}
        />
        <button
          class="mt-2 px-4 py-1 text-sm text-blue-600 font-semibold rounded-full border border-blue-200 hover:text-white hover:bg-blue-600 disabled:bg-gray-400 disabled:text-white hover:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
          disabled={!!inputError}
          onClick={runFormulaCalculator}
        >
          Run
        </button>
        <div class="mt-6 mb-2">结果 = 公式 + 当前对象</div>
        <div>
          <textarea
            id="runFormulaResult"
            class={`${
              result.error
                ? "border-red-500 border-2"
                : "border-gray-300 border"
            } bg-gray-50 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 h-[10rem]`}
            value={result.outputData}
          />
          <label
            for="runFormulaResult"
            class={`block mt-2 text-sm font-medium ${
              result.error ? "text-red-500" : "text-gray-900"
            }`}
          >
            {result.outputDataType}
          </label>
        </div>
      </div>
      <div class="basis-2/3">
        {inputError
          ? <div class="mb-2 text-red-500">{inputError}</div>
          : <div class="mb-2">当前对象</div>}
        <textarea
          class={`font-mono w-full rounded-lg h-[50rem] ${
            inputError ? "border-red-500 border-2" : ""
          }`}
          value={inputData}
          onChange={(e) => setInputData(e.currentTarget.value)}
        />
      </div>
    </div>
  );

  async function runFormulaCalculator() {
    if (inputError || inputJson === undefined) {
      return;
    }
    const headers = new Headers({
      "Content-Type": "application/json",
    });
    const body: FormulaRunInput = { expr: expr, inputData: inputJson };
    let result: FormulaRunResult;
    try {
      const res = await fetch("http://127.0.0.1:8080/formula/run", {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        result = {
          error: true,
          outputDataType: `HTTPStatus${res.status}`,
          outputData: res.statusText,
        };
      } else {
        result = await res.json();
      }
    } catch (error) {
      result = {
        error: true,
        outputDataType: `FetchError`,
        outputData: String(error),
      };
    }
    setResult(result);
  }
}

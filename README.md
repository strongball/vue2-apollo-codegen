# 客製化 Apollo codegen

輸出範例如下
```
export const ${node.name!.value}QueryFn = async (apollo: DollarApollo<any>, variables?: ${operationVariablesTypes}): Promise<ApolloQueryResult<${operationResultType}>> => {
   const res = await apollo.query<${operationResultType}, ${operationVariablesTypes}>({
    query: ${documentVariableName},
    variables
  });
  return res;
}
```

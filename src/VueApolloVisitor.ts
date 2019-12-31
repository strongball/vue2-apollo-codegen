import { ClientSideBaseVisitor, LoadedFragment } from '@graphql-codegen/visitor-plugin-common';
import { GraphQLSchema, OperationDefinitionNode } from 'graphql';
import { Types } from '@graphql-codegen/plugin-helpers';

export default class VueApolloVisitor extends ClientSideBaseVisitor<any, any> {
  constructor(
    schema: GraphQLSchema,
    fragments: LoadedFragment[],
    rawConfig: any,
    documents: Types.DocumentFile[]
  ) {
    super(schema, fragments, rawConfig, {});
  }

  public getImports(): string[] {
    const baseImports = super.getImports();
    const dollarApollo = "import { DollarApollo } from 'vue-apollo/types/vue-apollo';";
    const apolloResult = "import { ApolloQueryResult } from 'apollo-client';";
    const fetchResult = "import { FetchResult } from 'apollo-link';";
    return [...baseImports, dollarApollo, apolloResult, fetchResult];
  }

  private _buildMutation(
    node: OperationDefinitionNode,
    documentVariableName: string,
    operationType: string,
    operationResultType: string,
    operationVariablesTypes: string
  ): string {
    const fn = `export const ${
      node.name!.value
    }MutateFn = async (apollo: DollarApollo<any>, variables?: ${operationVariablesTypes}): Promise<FetchResult<${operationResultType}>> => {
      const res = await apollo.mutate<${operationResultType}, ${operationVariablesTypes}>({
        mutation: ${documentVariableName},
        variables
      });
      return res;
    }`;
    return fn;
  }

  private _buildQuery(
    node: OperationDefinitionNode,
    documentVariableName: string,
    operationType: string,
    operationResultType: string,
    operationVariablesTypes: string
  ): string {
    const fn = `export const ${
      node.name!.value
    }QueryFn = async (apollo: DollarApollo<any>, variables?: ${operationVariablesTypes}): Promise<ApolloQueryResult<${operationResultType}>> => {
       const res = await apollo.query<${operationResultType}, ${operationVariablesTypes}>({
        query: ${documentVariableName},
        variables
      });
      return res;
    }`;
    return fn;
  }

  protected buildOperation(
    node: OperationDefinitionNode,
    documentVariableName: string,
    operationType: string,
    operationResultType: string,
    operationVariablesTypes: string
  ): string {
    if (operationType === 'Query') {
      return this._buildQuery(
        node,
        documentVariableName,
        operationType,
        operationResultType,
        operationVariablesTypes
      );
    } else if (operationType === 'Mutation') {
      return this._buildMutation(
        node,
        documentVariableName,
        operationType,
        operationResultType,
        operationVariablesTypes
      );
    }
    return '';
  }
}

import { ClientSideBaseVisitor, LoadedFragment } from '@graphql-codegen/visitor-plugin-common';
import { GraphQLSchema, OperationDefinitionNode } from 'graphql';
import { Types } from '@graphql-codegen/plugin-helpers';
export default class VueApolloVisitor extends ClientSideBaseVisitor<any, any> {
    constructor(schema: GraphQLSchema, fragments: LoadedFragment[], rawConfig: any, documents: Types.DocumentFile[]);
    getImports(): string[];
    private _buildMutation;
    private _buildQuery;
    protected buildOperation(node: OperationDefinitionNode, documentVariableName: string, operationType: string, operationResultType: string, operationVariablesTypes: string): string;
}

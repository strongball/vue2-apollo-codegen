'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const graphql = require('graphql');
const visitorPluginCommon = require('@graphql-codegen/visitor-plugin-common');

class VueApolloVisitor extends visitorPluginCommon.ClientSideBaseVisitor {
    constructor(schema, fragments, rawConfig, documents) {
        super(schema, fragments, rawConfig, {});
    }
    getImports() {
        const baseImports = super.getImports();
        const dollarApollo = "import { DollarApollo } from 'vue-apollo/types/vue-apollo';";
        const apolloResult = "import { ApolloQueryResult } from 'apollo-client';";
        const fetchResult = "import { FetchResult } from 'apollo-link';";
        return [...baseImports, dollarApollo, apolloResult, fetchResult];
    }
    _buildMutation(node, documentVariableName, operationType, operationResultType, operationVariablesTypes) {
        const fn = `export const ${node.name.value}MutateFn = async (apollo: DollarApollo<any>, variables: ${operationVariablesTypes}): Promise<FetchResult<${operationResultType}>> => {
      const res = await apollo.mutate<${operationResultType}, ${operationVariablesTypes}>({
        mutation: ${documentVariableName},
        variables
      });
      return res;
    }`;
        return fn;
    }
    _buildQuery(node, documentVariableName, operationType, operationResultType, operationVariablesTypes) {
        const fn = `export const ${node.name.value}QueryFn = async (apollo: DollarApollo<any>, variables: ${operationVariablesTypes}): Promise<ApolloQueryResult<${operationResultType}>> => {
       const res = await apollo.query<${operationResultType}, ${operationVariablesTypes}>({
        query: ${documentVariableName},
        variables
      });
      return res;
    }`;
        return fn;
    }
    buildOperation(node, documentVariableName, operationType, operationResultType, operationVariablesTypes) {
        if (operationType === "Query") {
            return this._buildQuery(node, documentVariableName, operationType, operationResultType, operationVariablesTypes);
        }
        else if (operationType === "Mutation") {
            return this._buildMutation(node, documentVariableName, operationType, operationResultType, operationVariablesTypes);
        }
        return '';
    }
}

const plugin = (schema, documents, config) => {
    const allAst = graphql.concatAST(documents.reduce((prev, v) => {
        return [...prev, v.content];
    }, []));
    const allFragments = [
        ...allAst.definitions.filter(d => d.kind === graphql.Kind.FRAGMENT_DEFINITION).map(fragmentDef => ({ node: fragmentDef, name: fragmentDef.name.value, onType: fragmentDef.typeCondition.name.value, isExternal: false })),
        ...(config.externalFragments || []),
    ];
    const visitor = new VueApolloVisitor(schema, allFragments, config, documents);
    const visitorResult = graphql.visit(allAst, { leave: visitor });
    return {
        prepend: visitor.getImports(),
        content: [visitor.fragments, ...visitorResult.definitions.filter(t => typeof t === 'string')].join('\n'),
    };
};

exports.plugin = plugin;

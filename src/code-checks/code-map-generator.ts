
export const getCodeMap = (): Map<string, Set<string>> =>{
    const codesMap = new Map<string, Set<string>>();

    codesMap.set("parameterCode", new Set<string>());

    return codesMap;
}
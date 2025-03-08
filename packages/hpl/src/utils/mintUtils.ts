export const getPrincipalGroupsQty = (principal: string) => {
    const groups = principal.split("-");
    return groups.length;
};
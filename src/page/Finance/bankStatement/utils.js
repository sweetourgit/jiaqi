export function getSession4D (){
    let userID= parseInt(window.sessionStorage.getItem('id'))
    let orgID=parseInt(window.sessionStorage.getItem('orgID'))
    let company=window.sessionStorage.getItem('topName')
    let topID=parseInt(window.sessionStorage.getItem('topID'))
    return {userID,orgID,company,topID}
}
export const getRoot= function(){
  return new Promise((resolve, reject) => {
    setTimeout(resolve.bind(null, '333'), 500);
  })
}
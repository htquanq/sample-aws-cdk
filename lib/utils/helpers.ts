export function stringToList(ipRange: string, startAt = 0) {
  const beginPort = Number(ipRange.split("-")[0])
  const endPort = Number(ipRange.split("-")[1])
  const portRange = range(endPort-beginPort + 1, beginPort);
  let tmp = Array();

  for(let i = 0; i < portRange.length; i+=5){
    const newItem = portRange.slice(i,i+5)
    tmp.push(newItem)
  }
  return tmp
}

function range(size: number, startAt = 0) {
  return [...Array(size).keys()].map(i => i + startAt)
}
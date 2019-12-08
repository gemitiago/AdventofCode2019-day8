const fs = require('fs');
let input = fs.readFileSync('./input.txt').toString();

//repl.it doesnt support array.flat so we need to create it
const flat=(array)=>{
  return array.toString().split(',');
}

const makeImageArray = (strInput, pixelWith, pixelHeight) => {
  //{layer:1,lines:[[1,2,3],[4,5,6]]}
  let result = [];

  for (let i = 1; i <= strInput.length; i++) {
    //isNewLayer
    if ((i - 1) % (pixelWith * pixelHeight) === 0) {
      //createNewLayerLine
      const layerNum = i === 1 ? i : result.length + 1;
      result.push({ layer: layerNum, lines: [[strInput[i - 1]]] });
    } else {
      const layer = result[result.length - 1];
      //isNewLayerLine
      if ((i - 1) % pixelWith === 0 || i === 1) {
        //createNewLayerLine
        layer.lines.push([strInput[i - 1]]);
      } else {
        //updateLayerLine
        const lastLayerLine = layer.lines[layer.lines.length - 1];
        lastLayerLine.push(strInput[i - 1]);
      }
    }
  }

  return result;
};

const calcNumberDigitsEqualsTo = (layerLines, strDigit) => {
  return flat(layerLines).reduce((acc, pixel) => {
    pixel === strDigit ? acc++ : (acc += 0);
    return acc;
  }, 0);
};

const calculatePart1 = (input, pixelWith, pixelHeight) => {
  const imgArray = makeImageArray(input, pixelWith, pixelHeight);
  let layerMinZeros = null;
  let minZeros = null;

  for (const layer of imgArray) {
    const countZeros = calcNumberDigitsEqualsTo(layer.lines, '0');

    if (countZeros < minZeros || layerMinZeros === null) {
      layerMinZeros = layer;
      minZeros = countZeros;
    }
  }

  const countOnes = calcNumberDigitsEqualsTo(layerMinZeros.lines, '1');
  const countTwos = calcNumberDigitsEqualsTo(layerMinZeros.lines, '2');
  return countOnes * countTwos;
};

const decodeImageInput = (input, pixelWith, pixelHeight) => {
  const imgArray = makeImageArray(input, pixelWith, pixelHeight);
  let decodedMsg = '';

  //0 is black, 1 is white, and 2 is transparent.
  decodedMsg = flat(imgArray[0].lines);

  for (let i = 0; i < decodedMsg.length; i++) {
    //if it's transparent we need to look for a non transparent pixel in the next layer
    if (decodedMsg[i] === '2') {
      for (const layer of imgArray) {
        const strLayer = flat(layer.lines);
        //if it finds a pixel non transparent change and stop looking
        if (strLayer[i] !== '2') {
          decodedMsg[i] = strLayer[i];
          break;
        }
      }
    }
  }

  //colors?
  const colors = ['█', ' '];
  decodedMsg = decodedMsg.map(pixel => colors[Number(pixel)]);

  //insert crlf?
  for (let i = 1; i <= decodedMsg.length; i++) {
    if ((i - 1) % pixelWith === 0 && i !== 1) {
      decodedMsg[i - 1] = '\n' + decodedMsg[i - 1];
    }
  }

  return decodedMsg.join('');
};

console.log(calculatePart1(input, 25, 6));
console.log(decodeImageInput(input, 25, 6));

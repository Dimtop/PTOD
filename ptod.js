const lpparser = require('./lpparser');
const fs= require('fs');

module.exports = function ptod(filenameInput){
    
    var parsedProblem = lpparser(filenameInput);

    var MinMaxInverted = convertProblemType(parsedProblem[4]);

    var ATranspose = convertRestrictionsToVariables(parsedProblem[0]);

    var c = normalizeConvertedProblem(parsedProblem[1],parsedProblem[2],parsedProblem[0])[0];

    var b = normalizeConvertedProblem(parsedProblem[1],parsedProblem[2],parsedProblem[0])[1];

    var convertedProblem = printConvertedProblem(ATranspose,b,c,parsedProblem[3],MinMaxInverted);

    fs.writeFileSync('./output.txt', convertedProblem);
    

}



function convertProblemType(MinMax){
    return MinMax[0] == 1?[-1]:[1];
}

function convertRestrictionsToVariables(A){
    
    var sizes = A.map(el => el.length);
    var maxSize = Math.max(...sizes);

    var ATranspose = [];

    for(var i=0;i<A.length;i++){
        ATranspose.push([]);
    }

    for(var i=0;i<A.length;i++){
        for(var j=0;j<A.length;j++){
            ATranspose[i].push(A[j][i]);
        }
    }

    for(var i=0;i<ATranspose.length;i++){
        if(ATranspose[i].length < maxSize){
            while(ATranspose[i].length < maxSize){
                ATranspose[i].push(0);
            }
        }
    }




    return ATranspose;
}

function normalizeConvertedProblem(b,c,A){
    var sizes = A.map(el => el.length);
    var maxSize = Math.max(...sizes);

    if(c.length < maxSize){
        while(c.length<=A.length){
            c.push(0);
        }
    }


    for(var i=0;i<b.length;i++){
        b[i] = Number(b[i]);
    }

    return [b,c];
}


function printConvertedProblem(ATranspose,c,b,Eqin,MinMaxInverted){
    
    var content = 
    "Min or Max:" +'\n' +
    MinMaxInverted + '\n' + '\n' + 
    "C table:" + '\n' + 
    JSON.stringify(b) + '\n' + '\n' + 
    "A table:" + '\n' + 
    JSON.stringify(ATranspose) + '\n' + '\n' + 
    "Inequalities operators (eqin table):" + '\n' + 
    JSON.stringify(Eqin) +'\n' + '\n' + 
    "B table:" + '\n' + 
    JSON.stringify(c); 

   return content;
}



const path = require('path')
const fs = require("fs")
var filename = process.argv[2];

function name (filename) {
  return path.basename(filename, path.extname(filename))
}

function createMyFile(filename, content) {
    fs.writeFile(filename , content, () => {
      console.log(`File ${filename} successfully created!`)
    })
  }

function parseINI(filename)
{
    const regex = /^[[\w][^\n]*/gm;
    let txt = fs.readFileSync(filename, "utf-8").toString();
    txt = txt.match(regex);
    let filejson ='{';
    
    for(let i=0;i<txt.length;i++)
    {
        if(txt[i].startsWith('[') && txt[i].endsWith(']'))
        {
            if(filejson== '{')
            {
                filejson += '\n"' + txt[i].substr(1,txt[i].length-2) + '" : [\n';
            }
            else
            {
                if(filejson.endsWith(','))
                {
                    filejson = filejson.substr(0,filejson.length-1)
                }
                filejson += '\n],\n';
                filejson += '"' + txt[i].substr(1,txt[i].length-2) +  '" : [\n';
            }
        }
        else
        {    
            let tmp = txt[i].split('=');
            let tmp2 = '';
            for(let ii=1;ii<tmp.length;ii++)
            {
               
                if(ii > 1)
                {
                    tmp2 += "="; 
                }
                tmp2 += tmp[ii];
            }
            
    
            if(tmp2.includes(";"))
            {
                tmp2 = tmp2.split(";")[0];
            }
    
            tmp2 =  tmp2.trim();
    
           if(tmp2.startsWith('"') && txt[i].endsWith('"'))
            {
                tmp2 = tmp2.substr(1,tmp2.length-2)
            }
    
            filejson += '\n{\n"' + tmp[0] + '" : "' + tmp2 + '"\n},';
        }
    }
    filejson += ']\n}'
    createMyFile(name(filename)+'.json', filejson)
}

function parseENV(filename,)
{
    const regex = /^[[\w][^\n]*/gm;
    let txt = fs.readFileSync(filename, "utf-8").toString();
    txt = txt.match(regex);
    let filejson ='{';
    
    for(let i=0;i<txt.length;i++)
    {  
        let tmp = txt[i].split('=');
        let tmp2 = '';
        for(let ii=1;ii<tmp.length;ii++)
        {
            
            if(ii > 1)
            {
                tmp2 += "="; 
            }
            tmp2 += tmp[ii];
        }
        

        if(tmp2.includes(";"))
        {
            tmp2 = tmp2.split(";")[0];
        }

        tmp2 =  tmp2.trim();

        if(tmp2.startsWith('"') && txt[i].endsWith('"'))
        {
            tmp2 = tmp2.substr(1,tmp2.length-2)
        }

        filejson += '"' + tmp[0] + '" : "' + tmp2 + '",\n';
    }
    filejson = filejson.substr(0,filejson.length-2)
    filejson += '\n}'
    createMyFile(name(filename)+'.json', filejson)
}

if(path.extname(filename) == ".ini")
{
    parseINI(filename);
}
else
{
    parseENV(filename);
} 
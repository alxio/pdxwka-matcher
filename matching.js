class Vertex {
    constructor() {
        this.e = [];
        this.match = null;
        this.fixing = false;
    }
}


let P; //players
let C; //countries
let SHUFFLE = true;

/*
https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array

Randomize array in-place using Durstenfeld shuffle algorithm */
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function solve(data) {
    // randomize players - first players on list have higher chance to get first of their countries.
    shuffleArray(data);
    P = {};
    C = {};
    for (let i in data) {
        P[i] = new Vertex();

        // randomize player preffered coutries.
        if (SHUFFLE) shuffleArray(data[i]);
        for (let j of data[i]) {
            if (j == 'none') {
                continue;
            }
            if (j == 'filler') {
                P[i].filler = true;
                continue;
            }
            if (C[j] == null) {
                C[j] = new Vertex();
            }
            P[i].e.push(j);
            C[j].e.push(i);
        }
    }

    for (let pName in P) {
        let p = P[pName];
        if (p.filler) {
            for (let cName in C) {
                if (!p.e.includes(cName)) {
                    p.e.push(cName);
                    C[cName].e.push(pName);
                }
            }
        }
    }
    firstMatch(P, C);
    fixMatch(P, C);
    let answer = "";
    for (let p in P) {
        answer += p + ': ' + P[p].match + '\n';
    }
    console.log(answer);
    return answer;
}

function firstMatch() {
    for (let pName in P) {
        let p = P[pName];
        for (let cName of p.e) {
            let c = C[cName];
            if (!c.match) {
                p.match = cName;
                c.match = pName;
                break;
            }
        }
    }
}

let lvl = 0;

function fixMatch() {
    for (let pName in P) {
        if (!P[pName].match) {
            lvl = 0;
            fix(pName);
        }
    }
}

function fix(pName) {
    let p = P[pName];
    if(p.fixing) return false;
    p.fixing = true;
    // console.log("fix: " + pName + " " + p);
    p.fixing = true;
    for (let cName of p.e) {
        let c = C[cName];
        if (!c.match) {
            p.match = cName;
            c.match = pName;
            p.fixing = false;
            return true;
        }
    }
    // can assume all of c.match != null now
    for (let cName of p.e) {
        let c = C[cName];
        if (c.match != pName) {
            if (fix(c.match)) {
                p.match = cName;
                c.match = pName;
                p.fixing = false;
                return true;
            }
        }
    }
    
    p.fixing = false;
}

function go() {
    let data = document.getElementById("inputArea").value;
    SHUFFLE = document.getElementById("randomize").checked;
    if (data.length == 0) {
        window.alert("No data - using example data.");
        document.getElementById("inputArea").value = example;
        return go();
    }

    console.log({ str: data });
    let lines = data.split('\n');
    for (let i in lines) {
        lines[i] = lines[i].trim();
    }
    let i = 0;
    if (lines[0].length < 2) {
        i = 2;
    }
    const player = 1;
    const country = 2;
    let mode = player;

    let players = {};
    let currentPlayer;

    // Awful parsing input to array compatible with YAML idea
    for (; i < lines.length; i++) {
        let line = lines[i];
        if (line.length == 0) {
            mode = player;
            continue;
        }
        if (mode == player) {
            currentPlayer = [];
            players[line] = currentPlayer;
            mode = country;
            continue;
        } else {
            currentPlayer.push(line);
        }
    }
    console.log(players);
    let ans = solve(players).split("\n").join("<br>\n");
    document.getElementById("solution").innerHTML = ans;
}

let fail =
`AA
1
2

BB
1
2
3

CC
1
2
3
4

DD
1
2
3
4
5

EE
1`;

let example =
    `
garpeq
tsang
gaeldom
opole
osman
sirhind

neko
tsang

kotlet
landshut
uesugi
filler

azeth
osman
songhai
rassids
bulgaria
uesugi

lodyga
sirhind
mysore
filler

luis
verona
saluzo
sirhind
mysore
uesugi

trexons
gascony
wessex
uesugi
mameluk
sirhind

ckielce
tafilalt
mameluk
filler

exter
mameluk
filler

beriand
sirhind
bulgaria
khorasan
wessex
finlandia
`
    ;
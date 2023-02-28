class Character {
    
    _life = 1
    maxLife = 1
    attack = 0
    defense = 0

    constructor(name) {
        this.name = name
    }

    get life() {
        return this._life
    }
    set life(newLife) {
        this._life = newLife < 0 ? 0 : newLife
    }
}

class Knight extends Character {
    constructor(name) {
        super(name || 'Samurai')
        this.life = 100
        this.attack = 10
        this.defense = 8
        this.maxLife = this.life
    }
}

class BigMonster extends Character {
    constructor(name) {
        super(name || 'Minotauro')
        this.life = 120
        this.attack = 10
        this.defense = 7
        this.maxLife = this.life
    }
}

let i = 0
let io = 1

class Stage {
    constructor(fighter1, fighter2, fighter1El, fighter2El, status1El, status2El, logObject) {
        this.fighter1 = fighter1
        this.fighter2 = fighter2
        this.fighter1El = fighter1El
        this.fighter2El = fighter2El
        this.status1El = status1El
        this.status2El = status2El
        this.log = logObject
    }
    config() {
        this.update()
        document.querySelector('.attackButton1').addEventListener('click', () => this.doAttack(this.fighter1, this.fighter2))
        document.querySelector('.revanche').addEventListener('click', () => this.revanche(this.fighter1, this.fighter2))

        this.log.addMessage(`Luta ${io}`, 'luta')

        document.querySelector('.charPlacar #placar').innerHTML = placar1
        document.querySelector('.monsterPlacar #placar').innerHTML = placar2

        this.round()
    }
    reset(attacking, attacked) {
        attacking.life = attacking.maxLife
        attacked.life = attacked.maxLife
        
        if (attacking == this.fighter1 || attacked == this.fighter1) {
            attacking.attack = 10
            attacking.defense = 8

            attacked.attack = 10
            attacked.defense = 7
        }

    }
    revanche(attacking, attacked) {

        if (attacking.life <= 0 && attacking == this.fighter1) {samuraiRevanche()}
        if (attacking.life <= 0 && attacking == this.fighter2) {minotauroRevanche()}

        if (attacked.life <= 0 && attacked == this.fighter1) {samuraiRevanche()}
        if (attacked.life <= 0 && attacked == this.fighter2) {minotauroRevanche()}

        io++ // Linha 40
        i = 0 // Linha 41

        this.log.addMessage(`Luta ${io}`, 'luta')
        this.round()
        
        this.reset(attacking, attacked)

        if (attacking.life >= 0 && attacked.life >= 0) {
            document.querySelector('.revanche').disabled = true
        }

        this.update()
    }
    round() {
        i++// Linha 40
        
        this.log.addMessage(`Round ${i}`, 'round')
        this.placar = document.querySelector('.rounds')
        this.placar.innerHTML = `Round ${i}`
        
        this.update()   
    }

    update() {
        // Fighter 1
        this.fighter1El.querySelector('.name').innerHTML = `${this.fighter1.name} - ${this.fighter1.life.toFixed(1)} HP`
        let f1Pct = (this.fighter1.life / this.fighter1.maxLife) * 100
        this.fighter1El.querySelector('.bar').style.width = `${f1Pct}%`

        // Fighter 2
        this.fighter2El.querySelector('.name').innerHTML = `${this.fighter2.name} - ${this.fighter2.life.toFixed(1)} HP`
        let f2Pct = (this.fighter2.life / this.fighter2.maxLife) * 100
        this.fighter2El.querySelector('.bar').style.width = `${f2Pct}%`
        
        // Scroll do log
        let logScroll = document.querySelector('.log')
        logScroll.scrollTop = logScroll.scrollHeight
        
    }

    combatBalance(attacking, attacked, halfLifeAtt, halfLifeDef) {
        
        let attackCrit = attacking.attack + 1

        if (attacking.life <= halfLifeAtt) {
            
            if (attacking == this.fighter1) {
                attacking.attack = attackCrit
            }
            if (attacking == this.fighter2) {
                attacking.attack = attackCrit
            }
        }

        let defenseRigid = attacked.defense + 0.5

        if (attacked. life <= halfLifeDef) {
            
            if (attacked == this.fighter1) {
                attacked.defense = defenseRigid
            } 
            if (attacked == this.fighter2) {
                attacked.defense = defenseRigid
            }
        }
    }

    doAttack(attacking, attacked) {

        let halfLifeAtt = attacking.maxLife / 2
        let halfLifeDef = attacked.maxLife / 2

        this.combatBalance(attacking, attacked, halfLifeAtt, halfLifeDef)

        let attackFactor = (Math.random() * 2).toFixed(2)
        let defenseFactor = (Math.random() * 2).toFixed(2)
        
        let actualAttack = attacking.attack * attackFactor
        let actualDefense = attacked.defense * defenseFactor
        
        let halfTheAttack = (actualAttack / 2)
        let recupLife = attacking.life + halfTheAttack

        if (actualAttack > actualDefense) {   
            attacked.life -= actualAttack

            if (attacking == this.fighter1) {animacoes('attack 1.5s')
                if (attacking.life > 0 && attacked.life > 0) {
                    setTimeout(() => {
                        animacoes2('minotauroAttack 1.5s')
                        this.doAttack(this.fighter2, this.fighter1)
                    }, 2000);
                }
            }
            
            if (attacking.life <= halfLifeAtt) {
                attacking.life = recupLife
                if (attacking == this.fighter1) {    
                    document.querySelector('#char #recup').style.display = 'block'
                }
                if (attacking == this.fighter2) {    
                    document.querySelector('#monster #recup').style.display = 'block'
                }
            }
            if (attacking.life >= halfLifeAtt) {
                if (attacking == this.fighter1) {    
                    document.querySelector('#char #recup').style.display = 'none'
                }
                if (attacking == this.fighter2) {    
                    document.querySelector('#monster #recup').style.display = 'none'
                }
            }

            if (attacked == this.fighter1) {animacoes('damage 1.5s')}
            if (attacked == this.fighter2) {animacoes2('minotauroDamage 1.5s')}

            this.log.addMessage(`${attacking.name} causou ${actualAttack.toFixed(2)} em ${attacked.name}`, attacking.name)

        } else {

            if (attacked == this.fighter1) {animacoes('defen 1.5s'), animacoes2('minotauroAttack 1.5s')}
            if (attacked == this.fighter2) {animacoes('attack 1.5s'), animacoes2('minotauroDefen 1.5s')
                if (attacking.life > 0 && attacked.life > 0) {
                    setTimeout(() => {
                        animacoes2('minotauroAttack 1.5s')
                        this.doAttack(this.fighter2, this.fighter1)
                    }, 2000);
                }
            }

            this.log.addMessage(`${attacked.name} conseguiu defender...`, attacked.name)
        }

        if (attacking.life > 0 && attacked.life > 0) {
            attackButtonVisibility(true, 0)
            
            if (attacking == this.fighter2) { 
                attackButtonVisibility(false, 1500)
                setTimeout(() => {
                    this.round()
                }, 1500);
            }
        } else {
            if (attacked == this.fighter1) {

                let monsterPlacar =document.querySelector('.monsterPlacar #placar')

                monsterPlacar.innerHTML = ''
                monsterPlacar.style.animation = 'rotate 2s'

                setTimeout(() => {
                    placar2++
                    monsterPlacar.innerHTML = placar2 // Linha 267
                }, 500);

                setTimeout(() => { 
                    monsterPlacar.style.animation = ''
                }, 2000);
                samuraiLose()
            }
            if (attacked == this.fighter2) {  

                let charPlacar = document.querySelector('.charPlacar #placar')

                charPlacar.innerHTML = ''
                charPlacar.style.animation = 'rotate 1s'

                setTimeout(() => {
                    placar1++ 
                    charPlacar.innerHTML = placar1 // Linha 266
                }, 500);
                
                setTimeout(() => {
                    charPlacar.style.animation = ''
                }, 2000);
                minotauroLose()
            }
        }

        if(attacking.life <= 0 || attacked.life <= 0) {
            if (attacking.life <= 0) {
                this.log.addMessage(`${attacked.name} derrotou ${attacking.name}`)
            }
            if (attacked.life <= 0) {
                this.log.addMessage(`${attacking.name} derrotou ${attacked.name}`)
            }
            setTimeout(() => {
                document.querySelector('.revanche').disabled = false
            }, 1500);

            this.update()
        }
        this.update()       
    }
}

let placar1 = 0
let placar2 = 0

class Log {
    list = []
    ii = 0

    constructor(listEl) {
        this.listEl = listEl
    }

    addMessage(msg, playerName) {
        this.list.push(msg)
        this.render(playerName)
    }
    render(playerName) {

        this.listEl.innerHTML += `<li class="${playerName}">${this.list[ii]}</li>`
        
        ii++
    }
}
let ii = 0

function animacoes(animacao) {
    let player = document.querySelector('.player')
    document.querySelector('.attackButton1').disabled = true
    player.style.animation = animacao
    setTimeout(() => {
        player.style.animation = ''
    }, 1500);
}
function animacoes2(animacao) {
    let player = document.querySelector('.bot')
    document.querySelector('.attackButton1').disabled = true
    player.style.animation = animacao
    setTimeout(() => {
        player.style.animation = ''
    }, 1500);
}
function minotauroLose() {
    let player = document.querySelector('.bot')
    document.querySelector('.attackButton1').disabled = true
    setTimeout(() => {
        player.style.animation = 'monsterLose 1.5s'
        player.style.opacity = '0'
    }, 1500);
}
function minotauroRevanche() {
    let player = document.querySelector('.bot')
    player.style.animation = 'minotauroRevanche 1.5s'
    player.style.opacity = '1'
    setTimeout(() => {
        document.querySelector('.attackButton1').disabled = false
        player.style.animation = 'monsterStop 5s infinite'
    }, 1600);
}
function samuraiLose() {
    let player = document.querySelector('.player')
    document.querySelector('.attackButton1').disabled = true
    setTimeout(() => {
        player.style.animation = 'samuraiLose 1.5s'
        player.style.opacity = '0'
    }, 1500);
}
function samuraiRevanche() {
    let player = document.querySelector('.player')
    document.querySelector('.attackButton1').disabled = true
    player.style.animation = 'samuraiRevanche 1.5s'
    player.style.opacity = '1'
    setTimeout(() => {
        document.querySelector('.attackButton1').disabled = false
        player.style.animation = 'playerStop 5s infinite'
    }, 1600);
}
function attackButtonVisibility(VH, time) {
    setTimeout(() => {
        document.querySelector('.attackButton1').disabled = VH
    }, time);
}
function start() {
    let input1 = document.querySelector('#name1')
    let input2 = document.querySelector('#name2')

    let name1 = input1.value
    let name2 = input2.value

    if (name1.includes(' ')) {
        name1 = null
    }
    if (name2.includes(' ')) {
        name2 = null
    }

    game(name1, name2)

    document.querySelector('.startSize').style.visibility = 'hidden'
    document.querySelector('.fightArea').style.opacity = "1"
    document.querySelector('.buttonsAndLog').style.opacity = "1"
    document.querySelector('.statistics').style.opacity = "1"
    samuraiRevanche()
    minotauroRevanche()
}

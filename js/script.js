
function game() {
    let log = new Log(document.querySelector('.log'))

    let char = new Knight('Samurai')
    let monster = new BigMonster('Monstro')

    const stage = new Stage(
        char,
        monster,
        document.querySelector('#char'),
        document.querySelector('#monster'),
        document.querySelector('#char .status'),
        document.querySelector('#monster .status'),
        log
    )
    stage.config()
}


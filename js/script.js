
function game(name1, name2) {

    let log = new Log(document.querySelector('.log'))

    let char = new Knight(name1)
    let monster = new BigMonster(name2)

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



let xp = 0;
let health = 100;
let gold = 500;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["stick"];
const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");
const currentWeaponText = document.querySelector("#currentWeaponText");

const weapons = [
    {
        name: "stick",
        power: 5,
    },
    {
        name: "Dagger",
        power: 30
    },
    {
        name: "Claw Hammer",
        power: 50
    },
    {
        name: "Diamond Sword",
        power: 100
    }
];

const monsters = [
    { name: "Slime", level: 2, health: 15 },
    { name: "Fanged Beast", level: 8, health: 60 },
    { name: "Dragon", level: 20, health: 300 },
];

const locations = [
    {
        name: "town square",
        "button text": ["Go to store", "Go to cave", "Fight dragon"],
        "button functions": [goStore, goCave, fightDragon],
        text: "You are in the town square. You see a sign that says \"Store\"."
    },
    {
        name: "store",
        "button text": ["Buy Health (10 gold)", "Buy weapon (30 gold)", "Go to Town Square"],
        "button functions": [buyHealth, buyWeapon, goTown],
        text: "You enter the store."
    },
    {
        name: "cave",
        "button text": ["Fight slime", "Fight fanged beast", "Go to town square"],
        "button functions": [fightSlime, fightBeast, goTown],
        text: "You enter the cave. You see some monsters."
    },
    {
        name: "fight",
        "button text": ["Attack", "Dodge", "Run"],
        "button functions": [attack, dodge, goTown],
        text: "You are fighting a monster."
    },
    {
        name: "kill monster",
        "button text": ["Go to town square", "Go to town square", "Go to town square"],
        "button functions": [goTown, goTown, easterEgg],
        text: 'The monster screams "Arg!" as it dies. You gain experience points and find gold.'
    },
    {
        name: "lose",
        "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
        "button functions": [restart, restart, restart],
        text: "You die. ☠️",
    },
    {
        name: "win",
        "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
        "button functions": [restart, restart, restart],
        text: "You defeat the dragon! YOU WIN THE GAME! 🏆",
    },
    {
        name: "easter egg",
        "button text": ["2", "8", "Go to town square?"],
        "button functions": [pickTwo, pickEight, goTown],
        text: "You find a secret game. Pick a number above. Ten numbers will be randomly chosen between 0 and 10.\
        If the number you choose matches one of the random numbers, you win!"

    }
];

// Initialize buttons
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

function update(location) {
    monsterStats.style.display = "none";
    button1.innerText = location["button text"][0];
    button2.innerHTML = location["button text"][1];
    button3.innerHTML = location["button text"][2];
    button1.onclick = location["button functions"][0];
    button2.onclick = location["button functions"][1];
    button3.onclick = location["button functions"][2];
    text.innerText = location.text;
}

function goTown() {
    update(locations[0]);
}

function goStore() {
    update(locations[1]);
}

function goCave() {
    update(locations[2]);
}

function fightDragon() {
    console.log("Fighting Dragon.");
}

function buyHealth() {
    if (gold >= 10) {
        gold -= 10;
        health += 10;
        goldText.innerHTML = gold;
        healthText.innerHTML = health;
    } else {
        text.innerHTML = "You do not have enough gold to buy health.";
    }
}

function buyWeapon() {
    if (currentWeapon < weapons.length - 1) {
        if (gold >= 30) {
            gold -= 30;
            currentWeapon++;
            goldText.innerHTML = gold;
            let newWeapon = weapons[currentWeapon].name;
            text.innerHTML = "You now have a " + newWeapon + ".";
            inventory.push(newWeapon);
            text.innerHTML += " In your inventory you have: " + inventory;
            currentWeaponText.innerHTML = inventory[currentWeapon];
        } else {
            text.innerHTML = "You do not have enough gold to buy a weapon.";
        }
    } else {
        text.innerHTML = "You already have the Diamon Sword, what more could you want?";
        button2.innerHTML = "Sell weapon for 15 gold";
        button2.onclick = sellWeapon;
    }

}

function sellWeapon() {
    if (inventory.length > 1) {
        gold += 15;
        goldText.innerHTML = gold;
        let currentWeapon = inventory.shift();
        text.innerHTML = "You sold a " + currentWeapon + ".";
        text.innerHTML += " In your inventory you have: " + inventory;
    } else {
        text.innerHTML = "Don't sell your only weapon!";
    }
}

function fightSlime() {
    fighting = 0;
    goFight(fighting);
}

function fightBeast() {
    fighting = 1;
    goFight(fighting);
}

function fightDragon() {
    fighting = 2;
    goFight(fighting);
}

function goFight() {
    update(locations[3]);
    monsterHealth = monsters[fighting].health;
    monsterStats.style.display = "block";
    monsterHealthText.innerHTML = monsters[fighting].health;
    monsterName.innerHTML = monsters[fighting].name;
}

function attack() {
    text.innerHTML = "The " + monsters[fighting].name + " attacks.";
    text.innerHTML += " You attack it with your " + weapons[currentWeapon].name + ".";
    health -= getMonsterAttackValue(monsters[fighting].level);
    if (isMonsterHit()) {
        let damage = weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;
        monsterHealth -= damage;
        text.innerHTML += " You did " + damage + " damage."
    } else {
        text.innerText += " You missed.";
    }

    monsterHealthText.innerHTML = monsterHealth;
    healthText.innerHTML = health;

    if (health <= 0) {
        lose();
    } else if (monsterHealth <= 0) {
        if (fighting === 2) {
            winGame();
        } else {
            defeatMonster();
        }
    }
    if (Math.random() <= .1 && inventory.length !== 1) {
        text.innerHTML += ' Your <span style="color: red;">' + inventory.pop() + '</span> breaks.';
        currentWeapon--;
        currentWeaponText.innerHTML = inventory[currentWeapon]
    }
}

function getMonsterAttackValue(monster_level) {
    const hit = (monster_level * 5) - Math.floor(Math.random() * xp);
    return hit > 0 ? hit : 0;
}

function isMonsterHit() {
    return Math.random() > .2 || health < 20;
}

function dodge() {
    text.innerHTML = "You dodge the attack from the " + monsters[fighting].name + "!";
}

function defeatMonster() {
    gold += Math.floor(monsters[fighting].level * 6.7);
    xp += monsters[fighting].level;
    goldText.innerHTML = gold;
    xpText.innerHTML = xp;
    update(locations[4]);
}

function lose() {
    update(locations[5]);
}

function restart() {
    xp = 0;
    gold = 50;
    health = 100;
    inventory = ["stick"];
    xpText.innerHTML = xp;
    goldText.innerHTML = gold;
    healthText.innerHTML = health;
    goTown();
}

function winGame() {
    update(locations[6]);
}

function easterEgg() {
    update(locations[7]);
}

function pickTwo() {
    pick(2);
}

function pickEight() {
    pick(8);
}

function pick(guess) {
    const numbers = [];
    while (numbers.length < 10) {
        numbers.push(Math.floor(Math.random() * 11));
    }
    text.innerText = "You picked " + guess + ". Here are the random numbers:\n";
    for (let i = 0; i < 10; i++) {
        text.innerText += numbers[i] + "\n";
    }
    if (numbers.includes(guess)) {
        text.innerHTML += "Correct! You win 25 gold!";
        gold += 25;
        goldText.innerHTML = gold;
    } else {
        text.innerHTML += "Wrong! You lose 10 health!";
        health -= 10;
        healthText.innerHTML = health;
        if (health <= 0) {
            lose();
        }
    }
}
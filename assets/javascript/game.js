
$(function(){
    //document on keydown event handler checking for every button click and acting on it if they are the arrow keys
    //also serves as a sign that a round has ended therefore we run checks on whether the player won or lost and also load stamina
    document.onkeydown = function(){
        if (game.inProgress){
            var action = event.key
            if(action === "ArrowUp"){
                player.direction = "bk"
                player.move('bk')
            }else
            if(action === "ArrowDown"){
                player.direction = "fr"
                player.move('fr')
            }else
            if(action === "ArrowLeft"){
                player.direction = "lf"
                player.move('lf')
            }else
            if(action === "ArrowRight"){
                player.direction = "rt"
                player.move('rt')
            }else{return}

            for(var i in comp){
                comp[i].move()
                death(comp[i])
            }
            if(comp.length==0){
               game.won()
            }
            death(player)
            player.staminaLoad()
        }
    }
    //when the start button is clicked game is started. 
    $("#start").click(function(){
        game.start()
        $(this).addClass('d-none')
        $("#levels").text("Level: "+game.level)
        $("#levels").removeClass('d-none')
        $(".villains").remove()
    });
    //if a player loses the restart button will appear. clicking on it resets core data that may have been changed in the previous game.
    //resets player.attacks to be default attacks and changes the default attack damage to the original version which is 10. 
    //(when a player upgrades this number can change so its important to reset it for a new game)
 
    $("#restart").click(function(){
        player.attacks = null
        for (var i in defaultAttacks){
            var attack = defaultAttacks[i]
            attack.damage=attacksRegularDamage[i]   
        }
        player.attacks = defaultAttacks
            //resets level
        game.level=1
        // resets first xp level to achieve a levelup,
        game.targetXp=100
        //removes the villains on screen, and empty the villains array named comp
        for(var i in comp){
            $("#"+comp[i].id).remove();
            comp[i]=null;
        }
        comp=[]
        //display the Select Character text and character bar
        $(".selectPlayer").removeClass('d-none')
        characterSelectorBar()
        //clear the player object
        player=null
        //close the lost modal
        $("#lostModal").modal('toggle')
    });
});

//game object stores important methods and values related to the overall game
var game = {
    inProgress : false,
    won:function(){
        game.inProgress=false;
        game.level+=1
        $(".selectVillains").removeClass('d-none')
        $("#start").text('Next Level')
        characterSelectorBar()
        $(".villains").removeClass('d-none')
    },
    lost:function(){
        $("#lostModal").modal({backdrop: 'static', keyboard: false})
    },    
    //describes the game level and game.level+3 is the max levelled villain you will encounter at each level. 
    //Not to be confused with player/villain levels
    level:1,
    //levelUp Dynamics: every time the player.xp reaches game.targetXp a new targetXp will be set via the game.newTargetXp method. 
    //new targetXps grow exponentially making each round harder than the other, and grows (although eventually grows faster) as Xp gained from killing enemies 
    targetXp:100,
    newTargetXp:function(){
        var newTarg = (100)**(1+player.level/30);
        game.targetXp = newTarg
    },
    dying:false,
    //starts the game by placing the player object and villain objects onto the screen. 
    //The player Object is located at a specific coordinate while villains are randomized within certain parameters.
    start: function(){
        var locList=[]
        for (var i in comp){
            var coordinates = getRandCoordinate()
            while(checkCoordinates(coordinates,locList)==='again'){
                coordinates = getRandCoordinate()
            }
            locList.push(coordinates)
            comp[i].create(coordinates[0],coordinates[1])
        }
        if (game.level===1){
            player.create(500,1200)
        }
        game.inProgress= true
        $(".selectVillains").addClass('d-none')
        $('.selectPlayer').addClass('d-none')
    }   
}

function getRandCoordinate(){
    var top = Math.floor(Math.random()*300)+200
    var left=Math.floor(Math.random()*1000)
    return[top,left]
}
//makes sure that no two villains (the top left corners of each div) will be in the same 50px^2 radius.
function checkCoordinates(coordinates,locList){ 
    var newTop = coordinates[0]
    var newLeft = coordinates[1]

    for (var i in locList){
        var oldTop = locList[i][0]
        var oldLeft = locList[i][1]
        if (((oldLeft-newLeft)**2)<(50**2) && ((oldTop-newTop)**2)<(50**2)){
            return 'again'
        }    
    }
}
//a constructor that can be used to create an attack object. Currently the game only utilizes one attack object that is melee. 
//But this can be used to add additional attacks in the future. Some attacks can have a stamina cost of more than the default player.maxStamina - thus encouraging users to increase their stamina levels by upgrading
function Attack(damage,staminaCost){
    this.damage=damage;
    this.staminaCost=staminaCost;
    this.hit=function(target){
        if(player.stamina>staminaCost){
            target.hp-=this.damage;
            player.stamina-=this.staminaCost;
        }
    }
}
 //to keep track of the base power of each attack before levelups
var attacksRegularDamage={
    melee:10
}
var defaultAttacks ={
    melee : new Attack(10,10)
}
var advancedAttacks={

}

//changes the position of an element based on the direction that the character is facing - which is based on which arrow button the user pressed. this function is run every time an arrow button is pressed
function changePosition(element,direction,topPos,leftPos){
    if (direction == "bk"){
        element.css({
            "top":String(topPos-10)+"px"
        })
    }
    if (direction == "fr"){
        element.css({
            "top":String(topPos+10)+"px"
        })
    }
    if (direction == "lf"){
        element.css({
            "left":String(leftPos-10)+"px"
        })
    }
    if (direction == "rt"){
        element.css({
            "left":String(leftPos+10)+"px"
        })
    }
}

//teleports character to another spot. it is used to bounce the player back everytime it collides with a villain
function placeCharacter(element,topPos,leftPos){
    element.css({
        'top':topPos,
        'left':leftPos,
    })
}
//checks for collisions and returns true when characters get within a certain distance. 
//returns true so that we can run a melee attack and a counter attack when collision occurs.
function collisionCheck(charIcon,direction,topPos,leftPos,compIcon,compTopPos,compLeftPos){
    //returns true if collision occurs so that melee attack can be registered
    //coming from bottom of npc
    if((0>compTopPos-topPos && compTopPos-topPos>-50 && (compLeftPos-leftPos)**2<(-30)**2)){
        if (direction=="bk"){
            placeCharacter(charIcon,topPos+30,leftPos)
            return true
        }
    }
    ////coming from top of npc
    if((0<compTopPos-topPos && compTopPos-topPos<40 && (compLeftPos-leftPos)**2<(-30)**2)){
         if(direction == "fr"){
            placeCharacter(charIcon,topPos-30,leftPos)
            return true
        }
    }
    //coming from right of npc
    if ((0>compLeftPos-leftPos && compLeftPos-leftPos>-40 && (compTopPos-topPos)**2<(-30)**2)){
        if(direction == "lf"){
            placeCharacter(charIcon,topPos,leftPos+30)
            return true
        }
    }
    //coming from left of npc
    if ((0<compLeftPos-leftPos && compLeftPos-leftPos<40 && (compTopPos-topPos)**2<(-30)**2)){
        if(direction == "rt"){
            placeCharacter(charIcon,topPos,leftPos-30)
            return true
        }
    }
}
//checks for whether the characters hp is less than zero. if so runs the dying animation (deathSeq) and then runs the dead method on characters object
function death(character){
    if(character.hp<=0){
        game.dying=true;
        var positionList = ["_fr1.gif","_lf1.gif","_bk1.gif","_rt1.gif"]
        var i=0
        var r=0
        var deathSeq = setInterval(()=>{
            deathAnim(positionList[r],character)
            r+=1
            if (r==4){r=0}
            i+=1
            if (i==8){
                clearInterval(deathSeq)
                $("#"+character.id).remove()
                game.dying=false;
            }
        },200)
        character.dead()
    }
}
function deathAnim(position,character){
    character.img=character.id+position;
    character.update();
}






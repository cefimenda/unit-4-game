
$(function(){
    player.create(300,450);
    for (var i in comp){
        comp[i].create((i+1)*3,(i+1)*6)
    }

    document.onkeydown = function(){
        var action = event.key
        if(action === "ArrowUp"){
            player.direction = "bk"
            player.move('bk')
        }
        if(action === "ArrowDown"){
            player.direction = "fr"
            player.move('fr')
        }
        if(action === "ArrowLeft"){
            player.direction = "lf"
            player.move('lf')
        }
        if(action === "ArrowRight"){
            player.direction = "rt"
            player.move('rt')
        }
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
});


var game = {
    won:function(){

    },
    lost:function(){

    },
    targetXp:100,
    newTargetXp:function(){
        var newTarg = game.targetXp**(1+player.level/50);
        game.targetXp = newTarg
    },
    dying:false
}


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

var defaultAttacks ={
    melee : new Attack(10,10)
}
var advancedAttacks={

}

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
function placeCharacter(element,topPos,leftPos){
    element.css({
        'top':topPos,
        'left':leftPos,
    })
}
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
function levelUp(){
    if(player.xp>=game.targetXp){
        $("#levelUpModal").modal('toggle')
        player.level+=1;
        player.xp-=game.targetXp;
        game.newTargetXp();
    }
}
//lvl 1 Villain('ID',[maxHP: 50,counter:2,killXp:25],lvl) lvl 2 Villain('ID',100,4,50) etc...





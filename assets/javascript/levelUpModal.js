$(function(){

    $('.upgradeButton').hover(function(){
        var descript = $(this).attr('descript');
        $('.upgradeDescription').text(descript);
    });
    $('.upgradeButton').on('click',function(){
        $("#levelUpModal").modal('toggle');
        var decision = $(this).attr('value');
        if(decision=='increaseMaxHealth'){
            player.maxHp+=20;
        }
        if(decision =='increaseMaxStamina'){
            player.maxStamina+=20;
        }
        if(decision =='increaseStaminaLoad'){
            player.staminaLoadSpeed+=2;
        }
        if(decision == 'increaseAttack'){
            player.attacks.melee.damage+=10
        }
        if (decision == 'increaseDefense'){
            player.defense+=1
        }
        player.stamina=player.maxStamina
        player.hp=player.maxHp
        player.update();
    });
});

function levelUp(){
    if(player.xp>=game.targetXp && player.hp>0){
        $("#levelUpModal").modal('toggle')
        player.level+=1;
        player.xp-=game.targetXp;
        game.newTargetXp();
    }
}
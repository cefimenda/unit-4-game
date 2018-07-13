$(function(){
    var charList=['scr1','pdn1','mst1','mnv1','bmg3','avt4','knt3','nja4','npc9','smr1','wmg1','zph1','npc4'];
    var evilList=['chr1','dvl1','skl1','spd1','syb1','thf1','thf2','thf3','trk1','wnv1','wnv2','npc5','npc6','npc7']
    for (var i in charList){
        var img = $("<img>").attr('src','assets/images/sprites/'+charList[i]+'_fr1.gif')
        img.attr('name',charList[i])
        img.addClass('hero')
        img.addClass('char')
        $(".heroes").append(img)
    }
    for (var i in evilList){
        var img = $("<img>").attr('src','assets/images/sprites/'+evilList[i]+'_fr1.gif')
        img.attr('name',evilList[i])
        img.addClass('villain')
        img.addClass('char')

        $(".villains").append(img)
    }
    var isWalking = false
    var walking;
    $('.char').hover(function(){
        if (isWalking ==false){
            isWalking = true
            walking = setInterval(()=>{
                walkAnim($(this))
            },200);
        }
    },function(){
        clearInterval(walking)
        isWalking=false
    });
});

function walkAnim(img){
    var link = img.attr('src')
    var name = img.attr('name')
    if (link.search('_fr1')>-1){
        img.attr('src','assets/images/sprites/'+name+'_fr2.gif')
    }else{
        img.attr('src','assets/images/sprites/'+name+'_fr1.gif')
    }
}
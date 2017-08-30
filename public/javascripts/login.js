$(function(){
    var $form_modal = $('.cd-user-modal'),
        $form_login = $form_modal.find('#cd-login'),
        $form_signup = $form_modal.find('#cd-signup'),
        $form_modal_tab = $('.cd-switcher'),
        $tab_login = $form_modal_tab.children('li').eq(0).children('a'),
        $tab_signup = $form_modal_tab.children('li').eq(1).children('a'),
        $main_nav = $('.main_nav');

    $form_modal_tab.on('click', function(event) {
        event.preventDefault();
        ( $(event.target).is( $tab_login ) ) ? login_selected() : signup_selected();
    });

    function login_selected(){
        $form_login.addClass('is-selected');
        $form_signup.removeClass('is-selected');
        $tab_login.addClass('selected');
        $tab_signup.removeClass('selected');
    }

    function signup_selected(){
        $form_login.removeClass('is-selected');
        $form_signup.addClass('is-selected');
        $tab_login.removeClass('selected');
        $tab_signup.addClass('selected');
    }

    //登录操作
    $("#login").on('click',function(){
        //获取数据
        var username = $("#signin-username").val().trim();
        var password = $("#signin-password").val().trim();
        //数据判断

        if(username === ""){

            $("#signin-username").css("border","1px solid red");
            $("#error").html("用户名不能为空！");

        }else if(password === ""){

            $("#signin-password").css("border","1px solid red");
            $("#error").html("密码不能为空！");

        }
        if(username !== "" && password !== ""){
            //发送请求
            $.ajax({
                type:'POST',
                url:'/index/login',
                data:{
                    username:username,
                    password:password
                },
                success:function(result){
                    console.log('result---',result);
                    if(result.code == '200'){
                        var username = {
                            username: result.user
                        }
                        localStorage.setItem('username', JSON.stringify(username));
                        window.location = result.msg+"?user="+result.user;
                    }
                },
                error:function(){
                    $("#error").html("网络错误");
                },
                complete:function(){
                    // console.log("complete");
                }
            });
        }
    });

    //注册操作
    $("#register").on('click',function(){
        //获取数据
        var username = $("#signup-username").val().trim();
        var password = $("#signup-password").val().trim();
        var nickName = $("#signup-nickName").val().trim();
        //数据判断
        if(username ===""){
            $("#signup-username").css("border","1px solid red");
            $("#register_error").html("用户名不能为空！");
        }else if(password ===""){
            $("#signup-password").css("border","1px solid red");
            $("#register_error").html("密码不能为空！");
        }else if(nickName ===""){
            $("#signup-password").css("border","1px solid red");
            $("#register_error").html("真实姓名不能为空！");
        }
        if(username !==""&&password !==""&&nickName !==""){
            //发送请求
            $.ajax({
                type:'POST',
                url:'/index/register',
                data:{
                    username:username,
                    password:password,
                    nickName:nickName
                },
                success:function(result){
                    console.log('register', result);
                    if(result.code == '1'){
                        var time = 3;
                        var intervalid = setInterval(function(){
                            if(time==0){
                                location.reload();
                                clearInterval(intervalid);
                            }
                            $("#register_error").html(result.msg+"请在"+time--+"s后登录...");
                            $("#register_error").css("color","green");
                        }, 1000);
                    }

                },
                error:function(){
                    $("#error").html("网络错误");
                },
                complete:function(){
                    // console.log("complete");
                }
            });
        }
    });

})
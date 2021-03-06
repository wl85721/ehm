import "../stylesheets/app.css";
import {  default as Web3 } from 'web3';
import {  default as contract } from 'truffle-contract';

import fitbody_artifacts from '../../build/contracts/Fitbody.json'


var accounts;
var Fitbody = contract(fitbody_artifacts);

var addressdir = {}
var contract_address = ""
window.account_one = ""

    console.log("Fitbody:"+Fitbody)

window.addEventListener('load', function() {

    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
        console.warn("Using metamask")
        // Use Mist/MetaMask's provider
        window.web3 = new Web3(web3.currentProvider);
        console.log(window.web3);
    } else {
        console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
        // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
        window.web3 = new Web3(new Web3.providers.HttpProvider("https://api.infura.io/v1/jsonrpc/ropsten"));
        console.log(window.web3);
    }

    Fitbody.setProvider(web3.currentProvider);
    console.log("读取账户和合约地址对应关系")
    var tmp = localStorage.data
    addressdir = JSON.parse(tmp)
    console.log(tmp)
    console.log("localStorage.data:"+localStorage.data)
    App.start();

});

window.onunload=function(){
    console.log("存储账户和合约地址对应关系")
    localStorage.data = JSON.stringify(addressdir)

    console.log("addressdir:"+addressdir)

    return "111";

}


window.App = { //where to close

    start: function() {
        var self = this;

        web3.eth.getAccounts(function(err, accs) {
            if (err != null) {
                alert("获取不到您的账户地址，请安装METAMASK");
                return;
            }

            if (accs.length == 0) {
                alert("获取不到您的账户地址，请打开METAMASK,并检查关闭隐私模式.");
                return;
            }
            accounts = accs;

            console.log("accs:"+accounts);

        });
        $("#login_in").click(function() {

            window.account_one = $("#address").val()

            $("#currentAddress").text(window.account_one)
            console.log(window.account_one)
            App.creatContract()


        });

        $("#createMember").click(function() {
            if ($("#name").val() != "" && $("#sno").val() != "") {
                App.creatMember($("#name").val(),$("#sno").val())
            } else {
                alert("姓名和学号都不能为空！")
            }
        });

        $("#setsubject").click(function() {
            if ($("#subject").val() != "" ){
                App.setsubject($("#subject").val())
            } else {
                alert("课程不能为空！")
            }
        });

        $("#createMembers").click(function() {
            var stu=$("#stu").val()
            if ($("#stu").val() != "" ) {
              stu=stu.split("\n")

              stu.forEach(function(value,i){
                                            value=value.split(",");
                                            App.creatMember(value[0],value[1]);
　　                                        console.log('forEach遍历:'+i+'--'+value[0]+'--'+value[1]);
                                           })
            } else {
                alert("不能为空！")
            }
        });

        $("#train").click(function() {
            //console.log($("#trainId").val())

            if ($("#trainId").val() != "") {
                var id = $("#trainId").val()
                var group1 = $("[name='Fruit']").filter(":checked");
                var choice = group1.attr("id")

                App.TrainBody(id, choice)
            } else {
                alert("Trainer's id can't be empty")
            }




        });
        $("#RestBody").click(function() {
            if ($("#activityId").val() != "") {
                console.log($("#activityId").val())

                var id = $("#activityId").val()

                App.RestBody(id)
            } else {
                alert("Rest people's id can't be empty")
            }




        });
        $("#IncreaseNutrition").click(function() {
            if ($("#activityId").val() != "") {

                console.log($("#activityId").val())

                var id = $("#activityId").val()

                App.IncreaseNutrition(id)
            } else {
                alert("People doing activity 's id can't be empty")
            }



        });
        $("#StudyKnowledg").click(function() {

            if ($("#activityId").val() != "") {
                console.log($("#activityId").val())

                var id = $("#activityId").val()

                App.StudyKnowledge(id)
            } else {
                alert("People doing activity 's id can't be empty")
            }



        });
        $("#changeOwner").click(function() {
            console.log($("#newOwner").val())

            var newAddress = $("#newOwner").val()

            App.transferOwnership(newAddress)


        });
    },

    creatContract : function() {
        console.log("ffffff",addressdir,"fffff", addressdir[ window.account_one],"fffff")

        if (addressdir[ window.account_one] != null) {

            contract_address = addressdir[ window.account_one]
            App.getAllMembersInfo()
            alert("登录成功")

        } else {
            Fitbody.new({from: window.account_one, gas:3000000}).then(function(instance){
                contract_address = instance.address
                addressdir[window.account_one] = contract_address
                App.getAllMembersInfo()
                alert("创建课程成功， 开始添加学生吧")
            }).catch(function(err){
                alert("创建失败")
                console.log(err);
            });
        }
    },

    getBodyCount : function(){
       //alert("getBodyCount")
        Fitbody.at(contract_address).then(function(instance){
            return instance.getBodyCount.call();
        }).then(function(num){
            console.log(num.toNumber());
            return num.toNumber();
        }).catch(function(err){
            console.log(err);
        });
    },
    getOwner : function(){
        alert("getBodyCount")
         Fitbody.at(contract_address).then(function(instance){
             return instance.owner.call();
         }).then(function(result){
             console.log(result);

         }).catch(function(err){
             console.log(err);
         });
     },
    creatMember : function(name,sno){
        //alert("creatMember")

        console.log(window.account_one)

        Fitbody.at(contract_address).then(function(instance){
            return instance.creatMember(name, sno, {from:  window.account_one, gas:1000000} );
        }).then(function(result){
            console.log(result);
            App.getAllMembersInfo()
            //alert("create success")
        }).catch(function(err){
            console.log(err);
            alert("添加失败")
        });
    },
    setsubject : function(name){
        //alert("creatMember")



        Fitbody.at(contract_address).then(function(instance){
            return instance.setsub(name, {from:  window.account_one, gas:1000000} );
        }).then(function(result){
            console.log(result);
            App.getAllMembersInfo()
            //alert("create success")
        }).catch(function(err){
            console.log(err);
            alert("添加失败")
        });
    },
    getMemberInfo : function(num, flag){
        //alert("getMemberInfo")

        Fitbody.at(contract_address).then(function(instance){
            return instance.members.call(num);
        }).then(function(result){

            // console.log(result[0].toNumber(), result[1].toNumber(),
            // result[2].toNumber(), result[3].toNumber(),
            // result[4].toNumber(),result[5], result[6],
            // result[9].toNumber()
            // );
            //console.log(result[8].toNumber(),result[9].toNumber())

            if (flag) {

                var tmp = ""


                if (result[10] == 0) {
                    tmp = "Not rest Yet"
                } else if (result[10] == 1) {
                    tmp = "Resting"
                }

                var rowTem = '<tr id = \"t'+ num  + '\" >' +
                '<td>' + num + '</td>' +
                '<td>' + result[5] + '</td>' +
                '<td>' + result[6] + '</td>' +
                '<td>' + result[0].toNumber() + '</td>' +
                '<td>' + result[1].toNumber() + '</td>' +
                '<td>' + result[2].toNumber() + '</td>' +
                '<td>' + result[3].toNumber() + '</td>' +
                '<td>' + result[4].toNumber() + '</td>' +
                '<td>' + result[9].toNumber() + '</td>' +
                '<td>' + tmp + '</td>' +
                '</tr>'


                $(".tablehead>tbody:last").append(rowTem);//复制tr，并且添加


            }

            return [result[0].toNumber(), result[1].toNumber(),
            result[2].toNumber(), result[3].toNumber(),
            result[4].toNumber(),result[5], result[6],
            result[10].toNumber()]

            //alert("get success")
        }).catch(function(err){
            console.log(err);
            alert("get failed")
        });
    },
    getAllMembersInfo : function(){
      //显示学生列表
        Fitbody.at(contract_address).then(function(instance){
           return instance.getBodyCount.call();
       }).then(function(num){
            var tmp = []
            $(".tablehead>tbody").empty();
            $(".table2>tbody").empty();
            for(var i = 0; i < num.toNumber(); i++) {
                App.getMemberInfo(i, true)
                App.bodyToOwner(i, true)
            }
       }).catch(function(err){
           console.log(err);
       });
       //查询课程名称
       Fitbody.at(contract_address).then(function(instance){
          return instance.getsub.call();
      }).then(function(sub){
       console.log(sub);
       $("#currentsubject").text(sub);
      }).catch(function(err){
          console.log(err);
      });
    },

    TrainBody : function(id, choice){
        //alert("TrainBody")

        Fitbody.at(contract_address).then(function(instance){
            return instance.TrainBody(id, choice,  {from:  window.account_one, gas:1000000});
        }).then(function(result){
            App.getAllMembersInfo()
            //alert("Train success")
        }).catch(function(err){
            console.log(err);
            alert("Train failed")
        });
    },

    RestBody : function(id){
        //alert("RestBody")
        //console.log( window.account_one)
        Fitbody.at(contract_address).then(function(instance){
            return instance.RestBody(id,  {from:  window.account_one, gas:1000000});
        }).then(function(result){
            console.log(result)
            App.getAllMembersInfo()
            //alert("Rest success")
        }).catch(function(err){
            console.log(err);
            alert("Rest failed")
        });
    },

    StudyKnowledge : function(id){
        //alert("StudyKnowledge")

        console.log( window.account_one)
        Fitbody.at(contract_address).then(function(instance){
            return instance.StudyKnowledge(id,  {from:  window.account_one, gas:1000000});
        }).then(function(result){
            App.getAllMembersInfo()
            //alert("Rest success")
        }).catch(function(err){
            console.log(err);
            alert("Study failed")
        });
    },
    IncreaseNutrition : function(id){
        //alert("StudyKnowledge")
        console.log( window.account_one)
        Fitbody.at(contract_address).then(function(instance){
            return instance.IncreaseNutrition(id,  {from: account_one, gas:1000000});
        }).then(function(result){
            App.getAllMembersInfo()
            //alert("get success")
        }).catch(function(err){
            console.log(err);
            alert("Increase failed")
        });
    },

    bodyToOwner : function(id, flag){
        //alert("StudyKnowledge")

        Fitbody.at(contract_address).then(function(instance){
            return instance.bodyToOwner.call(id);
        }).then(function(result){

            if (flag) {

                var rowTem = '<tr>' +
                '<td>' + result + '</td>' +
                '<td>' + id + '</td>' +
                '</tr>'

                $(".table2>tbody:last").append(rowTem);//复制tr，并且添加

            }
            //alert("IncreaseNutrition success")
        }).catch(function(err){
            console.log(err);
            alert(" failed")
        });
    },





};//loop for main

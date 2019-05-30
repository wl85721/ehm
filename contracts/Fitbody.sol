pragma solidity ^0.5.0;

import "./Ownable.sol";


contract Fitbody is Ownable {

    //成员属性
    struct member {
      uint chidao;   //迟到 6
      uint queqin;  //缺勤 5
      uint koufen; //扣分 3
      uint jiafen; //加分 7
      uint zongfen;//总分  10
      string name;//姓名
      string sno;//学号
      uint256 amount;
      uint256 lastjiafentime;
      uint256 lastkoufentime;
      uint increaseRatio;
      uint state;


    }


    //所有者地址
    mapping (uint256 => address) public bodyToOwner;
    //当前账户下健身人的个数
    mapping (address => uint256) internal ownerBodyCount;

    //当前账户下的学生数组
    member[] public  members;
    string public sub="ddddd";


    //创建学生的私有构造函数
     function _createMember(uint _chidao, uint _queqin,uint _koufen, uint _jiafen, uint _zongfen, string memory _name, string memory _sno, uint256 _amount) private {
         //require(msg.value >= 0.001 ether);

         uint256 id = members.push(member( _chidao,  _queqin,_koufen, _jiafen,  _zongfen, _name, _sno , _amount, now, now,1, 0)) - 1;
         bodyToOwner[id] = msg.sender;
         ownerBodyCount[msg.sender] = ownerBodyCount[msg.sender] + 1;

     }

     //创建学生
     function creatMember(string  calldata _name,string  calldata _sno) payable external {

         _createMember(0,0,0,0,100, _name, _sno, msg.value);
     }
    function setsub(string  calldata _sub) payable external {

        sub=_sub;
    }

    function getBodyCount() external view returns(uint256) {
        return members.length;
    }
    function getsub() external view returns(string memory) {
        return sub;
    }

    //训练训练不同部位，使不同部位的肌肉量增加
  function TrainBody (uint256 id, uint choice) external  {

      require(msg.sender == bodyToOwner[id]);

      require(members[id].state == 0);

      require(choice == 1 || choice == 2 || choice == 3 || choice == 4);

      member storage myMember = members[id];


      if (choice == 1) {
          require(myMember.zongfen >= 5);
          myMember.chidao +=1;
          myMember.zongfen -= 5;


      } else  if (choice == 2) {
          require(myMember.zongfen >= 10);
          myMember.queqin +=1;
          myMember.zongfen -= 10;


      } else  if (choice == 3) {
          require(myMember.zongfen >= 5);
          require((now - myMember.lastkoufentime)/1728 >= 1);
          myMember.koufen +=1;
          myMember.zongfen -= 5;
          myMember.lastkoufentime = now;

      } else  if (choice == 4) {
          require(myMember.zongfen >= 0);
          require((now - myMember.lastjiafentime)/1728 >= 1);
          myMember.jiafen +=1;
          myMember.zongfen += 5;
          myMember.lastjiafentime = now;

      } else {

      }

      myMember.increaseRatio = 1;

  }






}

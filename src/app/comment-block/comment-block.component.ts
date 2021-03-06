import { Component, OnInit, Input } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-comment-block',
  templateUrl: './comment-block.component.html',
  styleUrls: ['./comment-block.component.scss']
})
export class CommentBlockComponent implements OnInit {

  @Input() comment = 0;

  constructor(private apollo : Apollo) { }

  replies;
  showReply = false;

  user;

  myUser;

  newReplyDesc;

  isLiked;
  isDisiliked;

  likes = []
  disilikes = []

  users = [];

  addNewReply = false;

  replyValue = '';
  toggleAddReply(){
    this.addNewReply = !this.addNewReply;

    if(this.curComment.videoid == 0)
    {
      this.replyValue = '@' + this.user.name
    }
  }

  curDate = new Date()

  // this.day = this.date.getDate()
  // this.month = this.date.getMonth()
  // this.year = this.date.getFullYear()

  toggleLike(ignore){
    if(localStorage.getItem('users') == null){
      return
    }

    this.apollo
        .mutate({
          mutation : gql`
            mutation likecom($id: String!, $comid: String!){
              likecom(id:$id, chnid:$comid)
              {
                name
              }
            }
          `,
          variables : {
            id: this.myUser.id,
            comid: (this.curComment.id).toString(10),
          },
          refetchQueries: [{
            query: gql`
              query getCommentById($id: Int!){
                commentById(id: $id){
                  id,
                  desc,
                  day,
                  month,
                  year,
                  like,
                  disilike,
                  replycount,
                  replyto,
                  videoid,
                  userid,
                }
              }
            `,
            variables: {
              id: this.comment,
            }
          },{
            query: gql`
              query userById($userid: String!){
                userById(userid: $userid){
                  id,
                  name,
                  subscribers,
                  subscribed,
                  likedvideos,
                  likedcomments,
                  disilikedvideos,
                  disilikedcomments,
                  profilepic,
                }
              }
            `,
            variables: {
              userid: this.myUser.id,
            }
          }]
        }).subscribe(({ data }) => {
      console.log('got data', data);
      // this.isLiked = !this.isLiked;
      if ( this.currentUserInfo.likedcomments != "")
      {
        this.likes = this.currentUserInfo.likedcomments.split(",")
        // console.log(this.likes)
      }
      else {
        this.likes = []
      }

      if(this.isDisiliked == true && !ignore)
      {
        this.toggleDisilike(true)
      }
      // console.log(this.isLiked);
    },(error) => {
      console.log('there was an error sending the query', error);
    });
  }

  toggleDisilike(ignore){
    if(localStorage.getItem('users') == null){
      return
    }

    this.apollo
        .mutate({
          mutation : gql`
            mutation disilikelikecom($id: String!, $comid: String!){
              disilikecom(id:$id, chnid:$comid)
              {
                name
              }
            }
          `,
          variables : {
            id: this.myUser.id,
            comid: (this.curComment.id).toString(10),
          },
          refetchQueries: [{
            query: gql`
              query getCommentById($id: Int!){
                commentById(id: $id){
                  id,
                  desc,
                  day,
                  month,
                  year,
                  like,
                  disilike,
                  replycount,
                  replyto,
                  videoid,
                  userid,
                }
              }
            `,
            variables: {
              id: this.comment,
            }
          },{
            query: gql`
              query userById($userid: String!){
                userById(userid: $userid){
                  id,
                  name,
                  subscribers,
                  subscribed,
                  likedvideos,
                  likedcomments,
                  disilikedvideos,
                  disilikedcomments,
                  profilepic,
                }
              }
            `,
            variables: {
              userid: this.myUser.id,
            }
          }]
        }).subscribe(({ data }) => {
      console.log('got data', data);
      // this.isLiked = !this.isLiked;

      if ( this.currentUserInfo.disilikedcomments != "")
      {
        this.disilikes = this.currentUserInfo.disilikedcomments.split(",")
        // console.log(this.likes)
      }
      else {
        this.disilikes = []
      }

      if(this.isLiked == true && !ignore)
      {
        this.toggleLike(true)
      }
      // console.log(this.isLiked);
    },(error) => {
      console.log('there was an error sending the query', error);
    });
  }


  addNewReplyBtn(newdesc){

    this.apollo
        .mutate({
          mutation : gql`
          mutation newReply($userid: String!, $desc: String!, $day: Int!, $month: Int!, $year: Int!, $replyto: Int!){
            createComment( input: {
              userid: $userid
              videoid: 0
              like: 0
              disilike: 0
              desc: $desc
              day: $day
              month: $month
              year: $year
              replyto: $replyto
              replycount: 0
              postid: 0
            }){ replyto }
          }
          `,
          variables : {
            userid: this.myUser.id,
            desc: newdesc,
            day: this.curDate.getDate(),
            month: this.curDate.getMonth(),
            year: this.curDate.getFullYear(),
            replyto: (this.curComment.videoid == 0 ? this.curComment.replyto.toString() : this.curComment.id),
          },
          refetchQueries: [{
            query: gql`
              query getReply($replyto: Int!){
                replies(replyto: $replyto){
                  id,
                  day,
                  month,
                  year,
                  userid,
                  replycount,
                  replyto,
                  desc,
                  disilike,
                  like,
                }
              }
            `,
            variables: {
              replyto: this.curComment.id
            }
          },{
          query: gql`
            query getCommentById($id: Int!){
              commentById(id: $id){
                id,
                desc,
                day,
                month,
                year,
                like,
                disilike,
                replycount,
                replyto,
                videoid,
                userid,
              }
            }
          `,
          variables: {
            id: this.comment
          }
        },
        ]
        }).subscribe(({ data }) => {
      console.log('got data', data);
      console.log(this.replies);
    },(error) => {
      // console.log(this.myUser.id)
      // console.log(newdesc)
      // console.log(this.curDate.getDate())
      // console.log(this.curDate.getMonth())
      // console.log(this.curDate.getFullYear())
      // console.log(this.comment.id)
      console.log('there was an error sending the query', error);
    });
  }

  getReplies(){

    this.apollo
      .watchQuery({
        query: gql`
          query getReply($replyto: Int!){
            replies(replyto: $replyto){
              id,
              day,
              month,
              year,
              userid,
              replycount,
              replyto,
              desc,
              disilike,
              like,
            }
          }
        `,
        variables: {
          replyto: this.curComment.id
        }
      })
      .valueChanges.subscribe(result => {
        this.replies = result.data.replies
        console.log(this.replies)
      });
  }

  toggleReply(){
    if(this.showReply == false && !this.replies)
    {
      this.getReplies()
    }
    this.showReply = !this.showReply
  }

  getViewCount(view){
    var res;
    if(view >= 1000000)
    {
      res = (view/1000000).toFixed(1) + "M"
    }
    else if(view >= 1000)
    {
      res = (view/1000).toFixed(1) + "K"
    }
    else
    {
      res = view;
    }

    return res;
  }

  getPercentage(a1, a2){
    return Math.round((a1 / a2) * 100) + "%"
  }

  getDiff(day, month, year){
    const vidDate = (year * 365) + (month * 30) + day
    const current = new Date();
    const curDate = (current.getDate()) + ((current.getMonth()) * 30) + (current.getFullYear() * 365)
    const diff = curDate - vidDate

    var res;
    if(diff >= 365)
    {
      res = Math.round(diff/365) + " year ago";
    }
    else if(diff >= 30)
    {
      res = Math.round(diff/30) + " month ago";
    }
    else if(diff >= 7)
    {
      res = Math.round(diff/7) + " week ago"
      // console.log(res)
    }
    else if(diff == 0)
    {
      res = "today"
    }
    else
    {
      res = diff + " days ago"
    }

    return res
  }

  getMonthName(mon)
  {
    if(mon == 1)
    {
      return "Jan"
    }
    else if(mon == 2)
    {
      return "Feb"
    }
    else if(mon == 3)
    {
      return "Mar"
    }
    else if(mon == 4)
    {
      return "Apr"
    }
    else if(mon == 5)
    {
      return "May"
    }
    else if(mon == 6)
    {
      return "Jun"
    }
    else if(mon == 7)
    {
      return "Jul"
    }
    else if(mon == 8)
    {
      return "Aug"
    }
    else if(mon == 9)
    {
      return "Sep"
    }
    else if(mon == 10)
    {
      return "Oct"
    }
    else if(mon == 11)
    {
      return "Nov"
    }
    else if(mon == 12)
    {
      return "Dec"
    }

    return ""
  }

  curComment;
  currentUserInfo;

  ngOnInit(): void {
    console.log("testing")

    if(localStorage.getItem('users') == null){
      this.users = [];
    }
    else{
      console.log("masok")
      this.users = JSON.parse(localStorage.getItem('users'));
      this.myUser = this.users[0];

      this.apollo
        .watchQuery({
          query: gql`
            query userById($userid: String!){
              userById(userid: $userid){
                id,
                name,
                subscribers,
                subscribed,
                likedvideos,
                likedcomments,
                disilikedvideos,
                disilikedcomments,
                profilepic,
              }
            }
          `,
          variables: {
            userid: this.myUser.id,
          }
        })
        .valueChanges.subscribe(result => {
          this.currentUserInfo = result.data.userById
          this.currentUserInfo = this.currentUserInfo[0]

          if ( this.currentUserInfo.likedcomments != "")
          {
            this.likes = this.currentUserInfo.likedcomments.split(",")
          }
          else
          {
            this.likes = []
          }

          console.log(this.likes)


          if ( this.currentUserInfo.disilikedcomments != "")
          {
            this.disilikes = this.currentUserInfo.disilikedcomments.split(",")
            // console.log(this.likes)
          }
          else
          {
            this.disilikes = []
          }



          if (this.likes.includes((this.comment).toString(10)) )
          {
            this.isLiked = true;
            console.log("test")
          }
          else {
            this.isLiked = false;
          }

          console.log(this.isLiked)

          if (this.disilikes.includes((this.comment).toString(10)) )
          {
            this.isDisiliked = true;
          }
          else {
            this.isDisiliked = false;
          }

          // console.log(this.likes)
          // console.log(this.disilikes)
          // console.log(this.isLiked)
          // console.log(this.isDisiliked)
          // console.log(this.isLiked)
        })
    }

    this.apollo
      .watchQuery({
        query: gql`
          query getCommentById($id: Int!){
            commentById(id: $id){
              id,
              desc,
              day,
              month,
              year,
              like,
              disilike,
              replycount,
              replyto,
              videoid,
              userid,
            }
          }
        `,
        variables: {
          id: this.comment
        },

      })
      .valueChanges.subscribe(result => {
        this.curComment = result.data.commentById
        this.curComment = this.curComment[0]
        // console.log(this.curComment)

        this.apollo
          .watchQuery({
            query: gql`
              query userById($userid: String!){
                userById(userid: $userid){
                  id,
                  name,
                  profilepic,
                  disilikedcomments,
                  likedcomments,
                }
              }
            `,
            variables: {
              userid: this.curComment.userid,
            }
          })
          .valueChanges.subscribe(result => {
            this.user = result.data.userById
            this.user = this.user[0]
          })
      });


  }

}

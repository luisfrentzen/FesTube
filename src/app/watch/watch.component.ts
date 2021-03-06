import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../data.service';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-watch',
  templateUrl: './watch.component.html',
  styleUrls: ['./watch.component.scss']
})
export class WatchComponent implements OnInit {

  url = "";

  constructor(private apollo : Apollo, private route : ActivatedRoute, private router : Router, private data : DataService) { }

  videos;
  targetVideo;

  downloadVideo(){
    var element = document.createElement('a');
    element.setAttribute('href',
    'data:video/mp4;base64,'
    + btoa(encodeURIComponent(this.targetVideo.url)));
    console.log(this.targetVideo.url)
    element.setAttribute('download', this.targetVideo.name);

    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  toWatchView(nextPage){

    this.router.navigateByUrl('')
    this.router.navigateByUrl('watch/' + nextPage)
    // window.location.reload()

  }

  channel;

  isLiked;
  isDisiliked;

  likes = [];
  disilikes = [];


  comments;

  users = []
  user

  newCommentDesc;

  isBelled = false;
  notifieds;

  onNotification(){

    this.apollo
        .mutate({
          mutation : gql`
            mutation notify($id: String!, $chnid: String!){
              bellnotif(id:$id, chnid:$chnid){
                name
              }
            }
          `,
          variables : {
            id: this.currentUserInfo.id,
            chnid: this.channel.id,
          },
          refetchQueries: [{
            query: gql`
              query userById($userid: String!){
                userById(userid: $userid){
                  id,
                  name,
                  profilepic,
                  subscribers,
                  subscribed,
                  likedvideos,
                  likedcomments,
                  disilikedvideos,
                  disilikedcomments,
                  notified,
                }
              }
            `,
            variables: {
              userid: this.currentUserInfo.id,
            }
          }]
        }).subscribe(({ data }) => {
      console.log('got data', data);

      this.isBelled = !this.isBelled
      console.log(this.isBelled)
      this.notifieds = this.currentUserInfo.notified.split(",")
      if(this.notifieds.includes(this.channel.id))
      {
        this.isBelled = true;
      }
      else
      {
        this.isBelled = false;
      }

    },(error) => {
      console.log('there was an error sending the query', error);
    });

  }

  toggleLike(ignore){
    if(localStorage.getItem('users') == null){
      return
    }

    this.apollo
        .mutate({
          mutation : gql`
            mutation likecom($id: String!, $comid: String!){
              likevid(id:$id, chnid:$comid)
              {
                name
              }
            }
          `,
          variables : {
            id: this.currentUserInfo.id,
            comid: (this.targetVideo.id).toString(10),
          },
          refetchQueries: [{
            query: gql`
              query videoById($id: Int!){
                videoById(id: $id){
                  id,
                  title,
                  url,
                  thumbnail,
                  userid,
                  channelpic,
                  channelname,
                  view,
                  day,
                  month,
                  year,
                  desc,
                  like,
                  disilike,
                  category,
                }
              }
            `,
            variables: {
              id: this.targetVideo.id,
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
                  notified,
                }
              }
            `,
            variables: {
              userid: this.currentUserInfo.id,
            }
          }]
        }).subscribe(({ data }) => {
      console.log('got data', data);
      // this.isLiked = !this.isLiked;

      if(this.isDisiliked == true && !ignore)
      {
        this.toggleDisilike(true)
      }

      if ( this.currentUserInfo.disilikedvideos != "")
      {
        this.disilikes = this.currentUserInfo.disilikedvideos.split(",")
        // console.log(this.likes)
      }
      else {
        this.disilikes = []
      }

      if ( this.currentUserInfo.likedvideos != "")
      {
        this.likes = this.currentUserInfo.likedvideos.split(",")
        // console.log(this.likes)
      }
      else {
        this.likes = []
      }

      if ( this.likes.includes(this.targetVideo.id) )
      {
        this.isLiked = true;
      }
      else
      {
        this.isLiked = false;
      }

      if ( this.disilikes.includes(this.targetVideo.id) )
      {
        this.isDisiliked = true;
      }
      else
      {
        this.isDisiliked = false;
      }
      // console.log(this.isLiked);
    },(error) => {
      console.log('there was an error sending the query', error);
    });
  }

  toggleDisilike(ignore){
    // console.log(this.myUser.id)
    if(localStorage.getItem('users') == null){
      return
    }

    this.apollo
        .mutate({
          mutation : gql`
            mutation disilikelikecom($id: String!, $comid: String!){
              disilikevid(id:$id, chnid:$comid)
              {
                name
              }
            }
          `,
          variables : {
            id: this.currentUserInfo.id,
            comid: (this.targetVideo.id).toString(10),
          },
          refetchQueries: [{
            query: gql`
              query videoById($id: Int!){
                videoById(id: $id){
                  id,
                  title,
                  url,
                  thumbnail,
                  userid,
                  channelpic,
                  channelname,
                  view,
                  day,
                  month,
                  year,
                  desc,
                  like,
                  disilike,
                  category,
                }
              }
            `,
            variables: {
              id: this.targetVideo.id,
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
                  notified,
                }
              }
            `,
            variables: {
              userid: this.currentUserInfo.id,
            }
          }]
        }).subscribe(({ data }) => {
      console.log('got data', data);
      // this.isLiked = !this.isLiked;

      if(this.isLiked == true && !ignore)
      {
        this.toggleLike(true)
      }

      if ( this.currentUserInfo.disilikedvideos != "")
      {
        this.disilikes = this.currentUserInfo.disilikedvideos.split(",")
        // console.log(this.likes)
      }
      else {
        this.disilikes = []
      }

      if ( this.currentUserInfo.likedvideos != "")
      {
        this.likes = this.currentUserInfo.likedvideos.split(",")
        // console.log(this.likes)
      }
      else {
        this.likes = []
      }

      if ( this.likes.includes(this.targetVideo.id) )
      {
        this.isLiked = true;
      }
      else
      {
        this.isLiked = false;
      }

      if ( this.disilikes.includes(this.targetVideo.id) )
      {
        this.isDisiliked = true;
      }
      else
      {
        this.isDisiliked = false;
      }
      // console.log(this.isLiked);
    },(error) => {
      console.log('there was an error sending the query', error);
    });
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

  curDate = new Date();

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
    if(mon == 0)
    {
      return "Jan"
    }
    else if(mon == 1)
    {
      return "Feb"
    }
    else if(mon == 2)
    {
      return "Mar"
    }
    else if(mon == 3)
    {
      return "Apr"
    }
    else if(mon == 4)
    {
      return "May"
    }
    else if(mon == 5)
    {
      return "Jun"
    }
    else if(mon == 6)
    {
      return "Jul"
    }
    else if(mon == 7)
    {
      return "Aug"
    }
    else if(mon == 8)
    {
      return "Sep"
    }
    else if(mon == 9)
    {
      return "Oct"
    }
    else if(mon == 10)
    {
      return "Nov"
    }
    else if(mon == 11)
    {
      return "Dec"
    }

    return ""
  }

  sortBy = ""

  autoplay = false;

  toggleSort(){
    if(this.sortBy == "")
    {
      this.sortBy = "like"
    }
    else {
      this.sortBy = ""
    }

    this.apollo
      .watchQuery({
        query: gql`
          query commentByVid($videoid: Int!, $sortBy: String!){
            commentsByVideo(videoid: $videoid, sort: $sortBy){
              id,
              day,
              month,
              year,
              userid,
              replycount,
              desc,
              disilike,
              like,
              replyto,
            }
          }
        `,
        variables: {
          videoid: this.targetVideo.id,
          sortBy: this.sortBy
        }
      })
      .valueChanges.subscribe(result => {
        this.comments = result.data.commentsByVideo
        // console.log(this.comments)

        if(this.sortBy == 'like')
        {
          let i = 0;
          while (this.comments[0].like == 0) {
            let val = this.comments.shift()
            this.comments.push(val)
          }

          this.comments.sort(this.compareLike)
        }
        else {
          this.comments.sort(this.compareDate)
        }
      });

      // console.log(th)
  }

  addNewCommentBtn(newdesc){
    if(!this.user){
      return
    }
    this.apollo
        .mutate({
          mutation : gql`
          mutation newComment($userid: String!, $desc: String!, $day: Int!, $month: Int!, $year: Int!, $videoid: Int!){
            createComment( input: {
              userid: $userid
              videoid: $videoid
              like: 0
              disilike: 0
              desc: $desc
              day: $day
              month: $month
              year: $year
              replyto: 0
              replycount: 0
              postid: 0
            }){ replyto }
          }
          `,
          variables : {
            userid: this.user.id,
            desc: newdesc,
            day: this.curDate.getDate(),
            month: this.curDate.getMonth(),
            year: this.curDate.getFullYear(),
            videoid: this.targetVideo.id,
          },
          refetchQueries: [{
            query: gql`
              query commentByVid($videoid: Int!){
                commentsByVideo(videoid: $videoid, sort: ""){
                  id,
                  day,
                  month,
                  year,
                  userid,
                  replycount,
                  desc,
                  disilike,
                  like,
                  replyto,
                }
              }
            `,
            variables: {
              videoid: this.targetVideo.id,
            },
          }
        ]
        }).subscribe(({ data }) => {
      console.log('got data', data);
    },(error) => {
      // console.log(this.user.id)
      // console.log(newdesc)
      // console.log(this.curDate.getDate())
      // console.log(this.curDate.getMonth())
      // console.log(this.curDate.getFullYear())
      // console.log(this.targetVideo.id)

      console.log('there was an error sending the query', error);
    });
  }

  currentUserInfo;
  isSubscribed = false;

  subs = [];

  toggleSubs(){
    if(localStorage.getItem('users') == null){
      return
    }

    this.apollo
        .mutate({
          mutation : gql`
            mutation subscribe($id: String!, $chnid: String!){
              subscribe(id: $id, chnid: $chnid){
                name
              }
            }
          `,
          variables : {
            id: this.currentUserInfo.id,
            chnid: this.targetVideo.userid,
          },
          refetchQueries: [{
            query: gql`
              query userById($userid: String!){
                userById(userid: $userid){
                  id,
                  name,
                  profilepic,
                  subscribers,
                  subscribed,
                  likedvideos,
                  likedcomments,
                  disilikedvideos,
                  disilikedcomments,
                  profilepic,
                  notified,
                }
              }
            `,
            variables: {
              userid: this.targetVideo.userid,
            }
          },
          {
            query: gql`
              query userById($userid: String!){
                userById(userid: $userid){
                  id,
                  name,
                  profilepic,
                  subscribers,
                  subscribed,
                  likedvideos,
                  likedcomments,
                  disilikedvideos,
                  disilikedcomments,
                  notified,
                }
              }
            `,
            variables: {
              userid: this.currentUserInfo.id,
            }
          }]
        }).subscribe(({ data }) => {
      console.log('got data', data);
      this.isSubscribed = !this.isSubscribed

      if(this.currentUserInfo.subscribed = "")
      {
        this.subs = this.currentUserInfo.subscribed.split(",")
      }
      else
      {
        this.subs = []
      }

      if ( this.subs.includes(this.targetVideo.userid) )
      {
        this.isSubscribed = true;
      }
      else
      {
        this.isSubscribed = false;
      }

      if(this.currentUserInfo.notified.includes(this.channel.id)){
        this.isBelled = true;
      }
      else {
        this.isBelled = false;
      }

    },(error) => {
      console.log('there was an error sending the query', error);
    });
  }

  curUserId = "";
  lastKey;
  lastComment;
  observer;
  plid;

  videosInPl = [];
  currentPlaylist;

  premi = ''

  compareLike(a,b){
    // let comparison = 0;

    if(a.like > b.like) {
      return -1
    }
    if(a.like < b.like){
      return 1
    }

    return 0;
  }

  compareDate(a,b){
    // let comparison = 0;

    if(a.year * 365 + a.month * 30 + a.day > b.year * 365 + b.month * 30 + b.day) {
      return -1
    }
    if(a.year * 365 + a.month * 30 + a.day < b.year * 365 + b.month * 30 + b.day){
      return 1
    }

    return 0;
  }

  showShareModal = false;;

  toggleShareModal = () => {
      this.data.toggleShareModal(!this.showShareModal);
      console.log("tes")
  }

  onKey = false;
  plindex;
  ngOnInit(){



    document.onkeyup = (e) => {
      let vid = document.getElementById('matVid').querySelector('video') as HTMLVideoElement
      e.preventDefault()
      if(this.onKey){
        if(e.keyCode == 74){
          vid.currentTime -= 10
        }
        if(e.keyCode == 75){
          vid.paused ? vid.play() : vid.pause()
        }
        if(e.keyCode == 76){
          vid.currentTime += 10
        }
        if(e.keyCode == 70){
          vid.requestFullscreen();
        }
        if(e.keyCode == 38){
          vid.volume += 0.2
        }
        if(e.keyCode == 40){
          vid.volume -= 0.2
        }
      }
    }

    this.data.currentShareModal.subscribe(showShareModal => this.showShareModal = showShareModal)
    // this.data.currentautoPlay.subscribe(autoPlay => this.autoplay = autoPlay)

    this.route.paramMap.subscribe(params => {
      const passedId = parseInt(params.get('id'));


      this.plid = params.get('playlistid');
      console.log(this.plid)

      if(this.plid)
      {
        this.apollo
          .mutate({
            mutation: gql`
              mutation viewPl($id: ID!){
                viewPlaylist(id: $id){
                  title
                }
              }
            `,
            variables: {
              id: this.plid,
            },
          })
          .subscribe(({ data }) => {
            console.log('got data', data);
            // this.isLiked = !this.isLiked;
            // console.log(this.isLiked);
            // this.addModeLink = false;
          },(error) => {
            console.log('there was an error sending the query', error);
          })

        this.apollo
          .watchQuery({
            query: gql`
              query playlistById($id: Int!){
                playlistById(id: $id){
                  id,
                  title,
                  userid,
                  view,
                  day,
                  month,
                  year,
                  desc,
                  videos,
                  visibility,
                }
              }
            `,
            variables: {
              id: this.plid,
            }
          })
          .valueChanges.subscribe(result => {
            this.currentPlaylist = result.data.playlistById
            this.currentPlaylist = this.currentPlaylist[0]
            console.log(this.currentPlaylist)


            this.apollo.watchQuery({
              query: gql`
                query videosByIds($id: String!){
                  videosByIds(id: $id){
                    id,
                    title,
                    thumbnail,
                    channelname,
                    userid,
                    view,
                    url,
                  }
                }
              `,
              variables: {
                id: this.currentPlaylist.videos,
              }
            })
            .valueChanges.subscribe(result => {
              let v = result.data.videosByIds

              let vinDb = this.currentPlaylist.videos.split(",")
              this.videosInPl = new Array(v.length)
              for (let i = 0; i < v.length; i++) {
                this.videosInPl[vinDb.indexOf(v[i].id)] = v[i]
              }
            })
          })
      }

      //
      // if(document.referrer.includes("playlist"))
      // {
      //   console.log("fromplaylist")
      // }

      this.apollo
        .mutate({
          mutation: gql`
            mutation viewVid($id: ID!){
              viewVideo(id: $id){
                title
              }
            }
          `,
          variables: {
            id: parseInt(passedId),
          },
        })
        .subscribe(({ data }) => {
          console.log('got data', data);
          // this.isLiked = !this.isLiked;
          // console.log(this.isLiked);
          // this.addModeLink = false;
        },(error) => {
          console.log('there was an error sending the query', error);
        })

      if(localStorage.getItem('users') == null){
        this.users = [];
        this.curUserId = "";

        this.apollo
          .watchQuery({
            query: gql`
              query videoById($id: Int!){
                videoById(id: $id){
                  id,
                  title,
                  url,
                  thumbnail,
                  userid,
                  channelpic,
                  channelname,
                  view,
                  day,
                  month,
                  year,
                  desc,
                  like,
                  disilike,
                  premium,
                  category,
                }
              }
            `,
            variables: {
              id: passedId,
            }
          })
          .valueChanges.subscribe(result => {
            this.targetVideo = result.data.videoById
            this.targetVideo = this.targetVideo[0]
            console.log(this.targetVideo)


            if(this.targetVideo.premium == 'yes'){
              this.router.navigateByUrl('')
            }

            this.apollo
              .watchQuery({
                query: gql`
                  query userById($userid: String!){
                    userById(userid: $userid){
                      id,
                      name,
                      profilepic,
                      subscribers,
                      subscribed,
                      likedvideos,
                      likedcomments,
                      disilikedvideos,
                      disilikedcomments,
                      premium,
                      notified,
                    }
                  }
                `,
                variables: {
                  userid: this.targetVideo.userid,
                }
              })
              .valueChanges.subscribe(result => {
                this.channel = result.data.userById
                this.channel = this.channel[0]


                var tag = document.getElementById('matVid').querySelector('video') as HTMLVideoElement
                console.log(tag)
                tag.onended = () => {
                  if(this.autoplay){
                    if(this.plid){
                      this.videosInPl.forEach((element, index) => {
                        if(element.id == this.targetVideo.id)
                        {
                          this.plindex = index;
                          // break;
                        }
                      });
                      console.log(this.plindex)
                      console.log(this.videosInPl)

                      var url = './watch/' + this.videosInPl[this.plindex+1].id + '/' + this.plid
                      this.router.navigate([url]);
                    }
                    else {
                      var url = './watch/' + this.videos[0].id
                      this.router.navigate([url]);
                    }
                  }
                }

                if ( this.subs.includes(this.channel.id) )
                {
                  this.isSubscribed = true;
                }
                else
                {
                  this.isSubscribed = false;
                }


              });

            this.apollo
              .watchQuery({
                query: gql`
                  query commentByVid($videoid: Int!){
                    commentsByVideo(videoid: $videoid, sort:""){
                      id,
                      day,
                      month,
                      year,
                      userid,
                      replycount,
                      desc,
                      disilike,
                      like,
                      replyto,
                    }
                  }
                `,
                variables: {
                  videoid: passedId
                }
              })
              .valueChanges.subscribe(result => {
                this.comments = result.data.commentsByVideo
                console.log(this.comments)
              });
          });


        this.apollo
          .watchQuery({
            query: gql`
              {
                videos(sort: "", filter: "", premium: "yes"){
                  id,
                  title,
                  url,
                  thumbnail,
                  userid,
                  channelpic,
                  channelname,
                  view,
                  day,
                  month,
                  year,
                }
              }
            `,
          })
          .valueChanges.subscribe(result => {
            this.videos = result.data.videos

            this.lastKey = 6;
            this.lastComment = 4;
            this.observer = new IntersectionObserver((entry) => {
              if(entry[0].isIntersecting){
                let card = document.querySelector(".recContainer")
                for(let i = 0; i < 3; i ++){
                  if(this.lastKey < this.videos.length){
                    let div = document.createElement("div")
                    let vid = document.createElement("app-video-block")
                    vid.setAttribute("video", this.videos[this.lastKey])
                    div.appendChild(vid)
                    card.appendChild(div)
                    this.lastKey++
                  }
                }

                let cont = document.querySelector(".commentContainer")
                for(let i = 0; i < 6; i ++){
                  if(this.lastComment < this.comments.length){
                    let div = document.createElement("div")
                    let vid = document.createElement("app-comment-block")
                    vid.setAttribute("comment", this.comments[this.lastComment].id)
                    div.appendChild(vid)
                    card.appendChild(div)
                    this.lastComment++
                  }
                }
              }
            })
            this.observer.observe(document.querySelector(".footer"))

          });
      }
      else{
        this.users = JSON.parse(localStorage.getItem('users'));
        this.user = this.users[0];

        if(this.user.premium == "yes"){
          this.premi = "yes"
        }

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
                  premium,
                  notified,
                }
              }
            `,
            variables: {
              userid: this.user.id,
            }
          })
          .valueChanges.subscribe(result => {
            this.currentUserInfo = result.data.userById
            this.currentUserInfo = this.currentUserInfo[0]
            this.curUserId = this.currentUserInfo.id;

            this.apollo
              .watchQuery({
                query: gql`
                  query videoById($id: Int!){
                    videoById(id: $id){
                      id,
                      title,
                      url,
                      thumbnail,
                      userid,
                      channelpic,
                      channelname,
                      view,
                      day,
                      month,
                      year,
                      desc,
                      like,
                      disilike,
                      premium,
                      visibility,
                      category,
                    }
                  }
                `,
                variables: {
                  id: passedId,
                }
              })
              .valueChanges.subscribe(result => {
                this.targetVideo = result.data.videoById
                this.targetVideo = this.targetVideo[0]
                console.log(this.targetVideo)



                if(this.targetVideo.premium == 'yes' && this.currentUserInfo.premium != 'yes'){
                  this.router.navigateByUrl('')
                }




                if ( this.currentUserInfo.subscribed != "")
                {
                  this.subs = this.currentUserInfo.subscribed.split(",")
                  console.log(this.subs)
                }
                else
                {
                  this.subs = []
                }

                if( this.currentUserInfo.likedvideos != "")
                {
                  this.likes = this.currentUserInfo.likedvideos.split(",")
                }
                else {
                  this.likes = []
                }

                if( this.currentUserInfo.disilikedvideos != "")
                {
                  this.disilikes = this.currentUserInfo.disilikedvideos.split(",")
                }
                else {
                  this.disilikes = []
                }

                if ( this.likes.includes(this.targetVideo.id) )
                {
                  this.isLiked = true;
                }
                else
                {
                  this.isLiked = false;
                }

                if ( this.disilikes.includes(this.targetVideo.id) )
                {
                  this.isDisiliked = true;
                }
                else
                {
                  this.isDisiliked = false;
                }


                console.log("Likes Disilikes")
                console.log(this.isLiked)
                console.log(this.isDisiliked)



                this.apollo
                  .watchQuery({
                    query: gql`
                      query userById($userid: String!){
                        userById(userid: $userid){
                          id,
                          name,
                          profilepic,
                          subscribers,
                          subscribed,
                          likedvideos,
                          likedcomments,
                          disilikedvideos,
                          disilikedcomments,
                          notified,
                        }
                      }
                    `,
                    variables: {
                      userid: this.targetVideo.userid,
                    }
                  })
                  .valueChanges.subscribe(result => {
                    this.channel = result.data.userById
                    this.channel = this.channel[0]

                    var tag = document.getElementById('matVid').querySelector('video') as HTMLVideoElement
                    console.log(tag)
                    tag.onended = () => {
                      if(this.autoplay){
                        if(this.plid){
                          this.videosInPl.forEach((element, index) => {
                            if(element.id == this.targetVideo.id)
                            {
                              this.plindex = index;
                              // break;
                            }
                          });
                          console.log(this.plindex)
                          console.log(this.videosInPl)

                          var url = './watch/' + this.videosInPl[this.plindex+1].id + '/' + this.plid
                          this.router.navigate([url]);
                        }
                        else {
                          var url = './watch/' + this.videos[0].id
                          this.router.navigate([url]);
                        }
                      }
                    }

                    if ( this.subs.includes(this.channel.id) )
                    {
                      this.isSubscribed = true;
                    }
                    else
                    {
                      this.isSubscribed = false;
                    }

                    if(this.currentUserInfo.notified.includes(this.channel.id)){
                      this.isBelled = true;
                    }
                    else{
                      this.isBelled = false;
                    }


                  });

                this.apollo
                  .watchQuery({
                    query: gql`
                      query commentByVid($videoid: Int!){
                        commentsByVideo(videoid: $videoid, sort: ""){
                          id,
                          day,
                          month,
                          year,
                          userid,
                          replycount,
                          desc,
                          disilike,
                          like,
                          replyto,
                        }
                      }
                    `,
                    variables: {
                      videoid: passedId
                    }
                  })
                  .valueChanges.subscribe(result => {
                    this.comments = result.data.commentsByVideo
                    console.log(this.comments)
                    console.log(this.targetVideo)
                  });

                  this.apollo
                    .watchQuery({
                      query: gql`
                        query videosByCategory($category: String!, $premi: String!){
                          videosByCategory(category: $category, sortBy: "date", premi: $premi){
                            id,
                            title,
                            url,
                            thumbnail,
                            userid,
                            channelpic,
                            channelname,
                            view,
                            day,
                            month,
                            year,
                            desc,
                            premium,
                          }
                        }
                      `,
                      variables: {
                        category: this.targetVideo.category,
                        premi: this.premi == 'yes' ? '' : 'yes',
                      }
                    })
                    .valueChanges.subscribe(result => {
                      this.videos = result.data.videosByCategory

                      this.videos.forEach((element,idx) => {
                        if(element.id == this.targetVideo.id){
                          this.videos.splice(idx,1)
                        }
                      });

                      this.lastKey = 6;
                      this.lastComment = 4;
                      this.observer = new IntersectionObserver((entry) => {
                        if(entry[0].isIntersecting){
                          let card = document.querySelector(".recContainer")
                          for(let i = 0; i < 3; i ++){
                            if(this.lastKey < this.videos.length){
                              let div = document.createElement("div")
                              let vid = document.createElement("app-video-block")
                              vid.setAttribute("video", this.videos[this.lastKey])
                              div.appendChild(vid)
                              card.appendChild(div)
                              this.lastKey++
                            }
                          }

                          let cont = document.querySelector(".commentContainer")
                          for(let i = 0; i < 6; i ++){
                            if(this.lastComment < this.comments.length){
                              let div = document.createElement("div")
                              let vid = document.createElement("app-comment-block")
                              vid.setAttribute("comment", this.comments[this.lastComment].id)
                              div.appendChild(vid)
                              card.appendChild(div)
                              this.lastComment++
                            }
                          }
                        }
                      })
                      this.observer.observe(document.querySelector(".footer"))

                    });
                })
              });


        }
    })



  }


    // if(id == 2)
    // {
    //   this.url = "https://firebasestorage.googleapis.com/v0/b/tpa-web-71a78.appspot.com/o/1.mp4?alt=media&token=7756e3e9-c27b-4c04-82ec-9bc88be81864"
    // }
    // else{
    //   this.url = "https://firebasestorage.googleapis.com/v0/b/festube-storage.appspot.com/o/vid%2F1594796961321_dummy.mp4?alt=media&token=530ae21d-6deb-4eef-81c3-b9c336de2c27"
    // }





}

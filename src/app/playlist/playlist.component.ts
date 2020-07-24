import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss']
})
export class PlaylistComponent implements OnInit {

  constructor(private route : ActivatedRoute, private apollo : Apollo) { }

  currentPlaylist;
  videos;
  playlistOwner;

  getLen(vids)
  {
    return vids.length
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

  users = [];
  user;

  curUserId;

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
            chnid: this.currentPlaylist.userid,
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
                }
              }
            `,
            variables: {
              userid: this.currentPlaylist.userid,
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

      if ( this.subs.includes(this.currentPlaylist.userid) )
      {
        this.isSubscribed = true;
      }
      else
      {
        this.isSubscribed = false;
      }

    },(error) => {
      console.log('there was an error sending the query', error);
    });
  }

  lastKey;
  observer;

  // checkScroll(){
  //   var d = document.querySelector(".playlistVideos")
  //   if(d.scrollHeight - d.offsetHeight - d.scrollTop < 1) {
  //     alert("test")
  //   }
  // }
  removeAll(){
    this.apollo
      .mutate({
        mutation: gql`
          mutation removevidfrompl($id: ID!) {
            removeAllFromPlaylist(id: $id ){
              title,
            }
          }
        `,
        variables: {
          id: parseInt(this.currentPlaylist.id),
        },
      })
      .subscribe(({ data }) => {
        console.log('got data', data);
        // this.isLiked = !this.isLiked;
        // console.log(this.isLiked);
        // this.addModeLink = false;
      },(error) => {
        console.log('there was an error sending the query', error);

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
                day,
                month,
                year,
              }
            }
          `,
          variables: {
            id: this.currentPlaylist.videos,
          }
        })
        .valueChanges.subscribe(result => {
          this.videos = result.data.videosByIds
          console.log(this.videos)
          window.location.reload();
        })
      });
  }

  removeVideo(vidid){
    console.log(parseInt(vidid))
    console.log(parseInt(this.currentPlaylist.id))
    this.apollo
      .mutate({
        mutation: gql`
          mutation removevidfrompl($id: ID!, $videoid: Int!) {
            removeFromPlaylist(id: $id, videoid: $videoid ){
              title,
            }
          }
        `,
        variables: {
          id: parseInt(this.currentPlaylist.id),
          videoid: parseInt(vidid),
        },
      })
      .subscribe(({ data }) => {
        console.log('got data', data);
        // this.isLiked = !this.isLiked;
        // console.log(this.isLiked);
        // this.addModeLink = false;
      },(error) => {
        console.log('there was an error sending the query', error);

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
                day,
                month,
                year,
              }
            }
          `,
          variables: {
            id: this.currentPlaylist.videos,
          }
        })
        .valueChanges.subscribe(result => {
          this.videos = result.data.videosByIds
          console.log(this.videos)
          // location.reload()
          window.location.reload();
        })
      });
  }

  viewVidFromPlaylist(){
    this.apollo
      .mutate({
        mutation: gql`
          mutation viewVid($id: ID!){
            viewPlaylist(id: $id){
              title
            }
          }
        `,
        variables: {
          id: parseInt(this.currentPlaylist.id),
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
  }

  ngOnInit(): void {

    const passedId = +this.route.snapshot.paramMap.get('id');
    // this.checkScroll()


    if(localStorage.getItem('users') == null){
      this.users = [];
      this.curUserId = "";
    }
    else{
      this.users = JSON.parse(localStorage.getItem('users'));
      this.user = this.users[0];
      // this.loggedIn = true;
      this.curUserId = this.user.id;
    }


    // this.lastKey = 10;
    // this.observer = new IntersectionObserver((entry) => {
    //   if(entry[0].isIntersecting){
    //     console.log("tes")
    //     let card = document.querySelector(".playlistVideos")
    //     for(let i = 0; i < 5; i ++){
    //       if(this.lastKey < (this.videos ? this.videos.length : 0)){
    //         let div = document.createElement("div")
    //         let vid = document.createElement("app-video-block")
    //         vid.setAttribute("video", this.videos[this.lastKey])
    //         div.appendChild(vid)
    //         card.appendChild(div)
    //         this.lastKey++
    //       }
    //     }
    //   }
    // })
    // this.observer.observe(document.querySelector(".footer"))

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
          id: passedId,
        }
      })
      .valueChanges.subscribe(result => {
        this.currentPlaylist = result.data.playlistById
        this.currentPlaylist = this.currentPlaylist[0]
        console.log(this.currentPlaylist)

        if(this.user)
        {
          this.apollo.watchQuery({
            query: gql`
              query getById($userid: String!){
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
                }
              }
            `,
            variables: {
              userid: this.curUserId,
            }
          })
          .valueChanges.subscribe(result => {
            this.currentUserInfo = result.data.userById
            this.currentUserInfo = this.currentUserInfo[0]

            this.subs = this.currentUserInfo.subscribed.split(",")
            if(this.subs.includes(this.currentPlaylist.userid))
            {
              this.isSubscribed = true;
            }
            else
            {
              this.isSubscribed = false;
            }
            // console.log(this.playlistOwner)
          })
        }

        this.apollo.watchQuery({
          query: gql`
            query getById($userid: String!){
              userById(userid: $userid){
                name,
                profilepic,
                id,
              }
            }
          `,
          variables: {
            userid: this.currentPlaylist.userid,
          }
        })
        .valueChanges.subscribe(result => {
          this.playlistOwner = result.data.userById
          this.playlistOwner = this.playlistOwner[0]
          console.log(this.playlistOwner)
        })

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
                day,
                month,
                year,
                url,
              }
            }
          `,
          variables: {
            id: this.currentPlaylist.videos,
          }
        })
        .valueChanges.subscribe(result => {
          this.videos = result.data.videosByIds
          console.log(this.videos)


        })
      })
  }

}

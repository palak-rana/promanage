import React, { useEffect, useState } from 'react'
import styles from "./Dashboard.module.css"
import downarrowimg from "../../images/downarrowimg.png"
import uparrowimg from "../../images/uparrowimg.png"
import collapseimg from "../../images/collapseimg.png"
import Ellipseimg from "../../images/Ellipseimg.png"
import Ellipse2img from "../../images/Ellipse2img.png"
import Ellipse3img from "../../images/Ellipse3img.png"
import threedotimg from "../../images/threedotimg.png"
import Delete from '../Delete/Delete'
import Createcard from '../Createcard/Createcard'
import addimg from "../../images/addimg.png"
import axios from 'axios'
import {CopyToClipboard} from "react-copy-to-clipboard"
import { commonapiurl, montharr } from '../../Constant'
import { setchecklistid } from '../../redux/Userslice'
import { useDispatch, useSelector } from 'react-redux'
import { addname, addpriority, setchecklistarr, setchecklistmarkedval, setdate, setfilterchecklist, setsectiontype } from '../../redux/Checklistslice'
import { createdate } from '../../utils/Createdate'
import { useLocation } from 'react-router-dom'
const Dashboard = () => {
  const[deletecontainershow, setdeletecontainershow] = useState(false)
  const[Createcardshow, setCreatecardshow] = useState(false)
  const[handlepopupcard, sethandlepopupcard] = useState(false)
  const[allchecklist, setallchecklist] = useState([])
  const[checklistchanged, setchecklistchanged] = useState(true)
  const[showchecklistobj, setshowchecklistobj] = useState({})
  const[openpopup, setopenpopup] = useState("")
  const userid = useSelector(store=>store.user.userid)
  const username = useSelector(store => store.user.name)
  const[closepopup, setclosepopup] = useState(true)
  const filterchecklist = useSelector(store=>store.checklist.filterchecklist)
  const[currendate, setcurrendate] = useState("")
  const[currentmonth, setcurrentmonth] = useState("")
  const[currentyear, setcurrentyear] = useState("")
  const[readonlychecklist, setreadonlychecklist] = useState("")
  const dispatch = useDispatch()
  const url = window.location.origin
  const[copied, setcopied] = useState(false)
  const[datecurrent, setdatecurrent] = useState("")
  const[Loading, setLoading] = useState(false)
  useEffect(() =>{
    setLoading(true)
    let tempdate = new Date()
    setcurrendate(tempdate.getDate())
    setcurrentmonth(tempdate.getMonth() + 1)
    setcurrentyear(tempdate.getFullYear())
    setdatecurrent(createdate())
    let query = "all"
    if(filterchecklist == "Today"){
      query = tempdate.getDate()
    }
    axios.get(commonapiurl + "checklist/getchecklist/" + userid + "?time=" + query)
    .then((response) =>{
      setLoading(false)
      let tempchecklist = response.data.allchecklist
      setallchecklist(
        tempchecklist.map(checklist => {
          if(checklist.duedate == "") return {...checklist, tempname : checklist.name.length < 28 ? checklist.name : checklist.name.slice(0, 28) + "..."}
          return {...checklist,
            date : parseInt(checklist.duedate.split("-")[2]),
            month : parseInt(checklist.duedate.split("-")[1]),
            year : parseInt(checklist.duedate.split("-")[0]),
            tempname : checklist.name.length < 28 ? checklist.name : checklist.name.slice(0, 28) + "...",
            duedatestring : (montharr[parseInt(checklist.duedate.split("-")[1]) - 1] + " " + checklist.duedate.split("-")[2] + "th")
          }
        })
      )
    })
    .catch((err) =>{
      console.log(err);
    })
  },[checklistchanged])
  function handlesectiontype(typeval, checklistid){
    setshowchecklistobj(
      Object.keys(showchecklistobj).filter(objKey => objKey != checklistid)
      .reduce((newObj, key) =>{
            newObj[key] = showchecklistobj[key];
            return newObj;
          },
      {})
    )  
    setallchecklist(
      allchecklist.map((checklistobj) =>{
        if(checklistid == checklistobj._id) return {...checklistobj, sectiontype : typeval}
        else return checklistobj
      })
    )
    axios.patch(commonapiurl + "checklist/updatechecklist/" + checklistid,{
      sectiontype : typeval
    })
    .then((response) =>{
      console.log(response.data.updatedchecklist);
    })
    .catch((err)=>{
      console.log(err);
    })
  }
  function updatemark(index, checklistid){
    let tempmark = 0;
    let tempchecklistarr = []
    setallchecklist(
      allchecklist.map((checklistobj) =>{
        if(checklistid == checklistobj._id){
          tempmark = checklistobj.markedval
          tempchecklistarr = 
          checklistobj.checklistarr.map((checklisttemp, i) =>{
            if(i == index){
              if(!checklisttemp.mark) tempmark = tempmark + 1
              else tempmark = tempmark - 1
              return {mark : !checklisttemp.mark, data : checklisttemp.data} 
            }
            return checklisttemp
          })
          return {...checklistobj, checklistarr : tempchecklistarr,markedval : tempmark}
        }
        else return checklistobj
      })
    )
    axios.patch(commonapiurl + "checklist/updatechecklist/" + checklistid, {
      markedval : tempmark, checklistarr : tempchecklistarr
    })
    .then((response) =>{
      console.log(response.data);
    })
    .catch((err) =>{
      console.log(err);
    })
  }
  function handleremovekey(checklistid){
    setshowchecklistobj(
    Object.keys(showchecklistobj).filter(objKey => objKey != checklistid)
    .reduce((newObj, key) =>{
          newObj[key] = showchecklistobj[key];
          return newObj;
        },
    {})
  )
  }
  function handleaddkey(checklistid, sectiontype){
    console.log(checklistid);
    setshowchecklistobj({
      ...showchecklistobj, [checklistid] : sectiontype
    })
  }
  function collapsechecklist(sectiontype){
    setshowchecklistobj(
      Object.keys(showchecklistobj).filter(objKey => showchecklistobj[objKey] != sectiontype)
      .reduce((newObj, key) =>{
            newObj[key] = showchecklistobj[key];
            return newObj;
          },
      {})
    )  
  }
  function closepopupfun(val){
    setopenpopup(val)
    if(openpopup == val) setopenpopup("")
  }
  function Editchecklist(checklistobj){
    dispatch(setchecklistid(checklistobj._id))
    dispatch(setsectiontype(checklistobj.sectiontype))
    dispatch(addname(checklistobj.name))
    dispatch(addpriority(checklistobj.priority))
    dispatch(setdate(checklistobj.duedate))
    dispatch(setchecklistarr(checklistobj.checklistarr))
    dispatch(setchecklistmarkedval(checklistobj.markedval))
    setCreatecardshow(true)
    setopenpopup("")
  }
  function handledeletechecklist(checklistid){
    setdeletecontainershow(true)
    dispatch(setchecklistid(checklistid))
    setopenpopup("")
  }
  function setmonthtype(value){
    dispatch(setfilterchecklist(value))
    sethandlepopupcard(!handlepopupcard)
    setchecklistchanged(!checklistchanged)
  }
  function handleshare(checklistid){
    setcopied(true)
    setTimeout(() => {
      setcopied(false)
    }, 1500);
    setopenpopup("")
  }
  function closepopupcontainer(){
    if(handlepopupcard){
      sethandlepopupcard(false)
    }
    if(openpopup){
      setopenpopup("")
    }
  }
  return(
    <>
    <div className={styles.maincontainer} onClick={closepopupcontainer}>
      <div className={styles.usernamedate}>
        <p>Welcome! {username}</p>
        <p>{datecurrent}</p>
      </div>
      <div className={styles.titledate}>
        <p>Board</p>
        <p
        onClick={()=>sethandlepopupcard(!handlepopupcard)}
        >{filterchecklist} <img src={downarrowimg} alt="" /></p>
        {
          handlepopupcard && 
          <div>
            <p onClick={()=>setmonthtype("Today")}>Today</p>
            <p onClick={()=>setmonthtype("This Week")}>This Week</p>
            <p onClick={()=>setmonthtype("This Month")}>This Month</p>
          </div>
        }
      </div>
      {
        Loading ? <div className={styles.Loading}>Loading...</div>
        :
        <div className={styles.sectioncontainer}>
        <div className={styles.section}>
          <div className={styles.sectiontitlecollapse}>
            <p>Backlog</p>
            <img src={collapseimg} alt="" 
            onClick={() => collapsechecklist("backlog")}
            />
          </div>
          <div className={styles.sectioncardcontainer}>
          {
            allchecklist.map((checklistobj) =>{
              return(checklistobj.sectiontype=="backlog")?(
                <div className={styles.sectioncard}>
                <div className={styles.priority}>
                  <div>
                    {
                      checklistobj.priority == "high" && <img src={Ellipseimg}/>
                    }
                    {
                      checklistobj.priority == "moderate" && <img src={Ellipse2img}/>
                    }
                    {
                      checklistobj.priority == "low" && <img src={Ellipse3img}/>
                    }
                    {
                      checklistobj.priority == "high" && <p>HIGH PRIORITY</p>
                    }
                    {
                      checklistobj.priority == "moderate" && <p>MODERATE PRIORITY</p>
                    }
                    {
                      checklistobj.priority == "low" && <p>LOW PRIORITY</p>
                    }
                  </div>
                  <div className={styles.threedotclass}
                    onClick={() => closepopupfun(checklistobj._id)}
                  >
                  <img src={threedotimg} alt="" 
                  />
                  </div>
                  {
                    checklistobj._id == openpopup &&
                    <div className={styles.popupcard}>
                      <p
                      onClick={() => Editchecklist(checklistobj)}
                      >Edit</p>
                      <CopyToClipboard text={url + "/readonlychecklist/" + checklistobj._id}>
                        <p onClick={()=>handleshare(checklistobj._id)}>Share</p>
                      </CopyToClipboard>
                      <p
                      onClick={() => handledeletechecklist(checklistobj._id)}
                      >Delete</p>
                    </div>
                  }
                </div>
                <h2>{checklistobj.tempname}</h2>
                <div className={styles.checklistclass}>
                  <p>Checklist {`(${checklistobj.markedval}/${checklistobj.checklistarr.length})`}</p>
                  {
                    showchecklistobj.hasOwnProperty(checklistobj._id)?
                    <img src={uparrowimg} alt="" 
                    onClick={()=>handleremovekey(checklistobj._id)}
                    /> : 
                    <img src={downarrowimg} alt="" 
                    onClick={()=>handleaddkey(checklistobj._id, "backlog")}
                    />
                  }
                </div>
                {
                  showchecklistobj.hasOwnProperty(checklistobj._id) &&
                  checklistobj.checklistarr.map((checklist, index) =>{
                    return(
                      <div className={styles.inputcheck}>
                        <input type="checkbox" 
                        checked={checklist.mark}
                        onClick={()=>updatemark(index, checklistobj._id)}
                        />
                        <input type="text" 
                        value={checklist.data}
                        />
                      </div>    
                    )
                  })
                }
                <div className={styles.datetype}>
                  {
                    checklistobj.duedate == "" &&
                    <button className={styles.notselected}></button>
                  }
                  {
                    checklistobj.year < currentyear &&
                    <button className={styles.selectedbtnred}>{checklistobj.duedatestring ? checklistobj.duedatestring : ""}</button>
                  }
                  {
                    checklistobj.year > currentyear &&
                    <button>{checklistobj.duedatestring ? checklistobj.duedatestring : ""}</button>
                  }                  
                  {
                    checklistobj.year == currentyear && checklistobj.month < currentmonth &&
                    <button className={styles.selectedbtnred}>{checklistobj.duedatestring ? checklistobj.duedatestring : ""}</button>
                  }                  
                  {
                    checklistobj.year == currentyear && checklistobj.month > currentmonth &&
                    <button>{checklistobj.duedatestring ? checklistobj.duedatestring : ""}</button>
                  }                  
                  {
                    checklistobj.year == currentyear && checklistobj.month == currentmonth &&
                    checklistobj.date < currendate &&
                    <button className={styles.selectedbtnred}>{checklistobj.duedatestring ? checklistobj.duedatestring : ""}</button>
                  }                  
                  {
                    checklistobj.year == currentyear && checklistobj.month == currentmonth &&
                    checklistobj.date >= currendate &&
                    <button>{checklistobj.duedatestring ? checklistobj.duedatestring : ""}</button>
                  }                  
                  <div>
                    <button onClick={()=>handlesectiontype("inprogress", checklistobj._id)}>PROGRESS</button>
                    <button onClick={()=>handlesectiontype("todo", checklistobj._id)}>TO-DO</button>
                    <button onClick={()=>handlesectiontype("done", checklistobj._id)}>DONE</button>
                  </div>
                </div>
              </div>    
              ):""
            })
          }
          </div>
        </div>
        <div className={styles.section}>
          <div className={styles.sectiontitlecollapse}>
            <p>To do</p>
            <div>
              <img src={addimg} alt="" 
              onClick={()=>setCreatecardshow(true)}
              />
              <img src={collapseimg} alt="" 
              onClick={() => collapsechecklist("todo")}
              />
            </div>
          </div>
          <div className={styles.sectioncardcontainer}>
          {
            allchecklist.map((checklistobj) =>{
              return(checklistobj.sectiontype=="todo")?(
                <div className={styles.sectioncard}>
                <div className={styles.priority}>
                  <div>
                    {
                      checklistobj.priority == "high" && <img src={Ellipseimg}/>
                    }
                    {
                      checklistobj.priority == "moderate" && <img src={Ellipse2img}/>
                    }
                    {
                      checklistobj.priority == "low" && <img src={Ellipse3img}/>
                    }
                    {
                      checklistobj.priority == "high" && <p>HIGH PRIORITY</p>
                    }
                    {
                      checklistobj.priority == "moderate" && <p>MODERATE PRIORITY</p>
                    }
                    {
                      checklistobj.priority == "low" && <p>LOW PRIORITY</p>
                    }
                  </div>
                  <div className={styles.threedotclass}
                    onClick={()=>closepopupfun(checklistobj._id)}
                  >
                  <img src={threedotimg} alt="" 
                  />
                  </div>
                  {
                    checklistobj._id == openpopup &&
                    <div className={styles.popupcard}>
                      <p
                      onClick={() => Editchecklist(checklistobj)}
                      >Edit</p>
                      <CopyToClipboard text={url + "/readonlychecklist/" + checklistobj._id}>
                        <p onClick={()=>handleshare(checklistobj._id)}>Share</p>
                      </CopyToClipboard>
                      <p
                      onClick={() => handledeletechecklist(checklistobj._id)}
                      >Delete</p>
                    </div>
                  }
                </div>
                <h2>{checklistobj.tempname}</h2>
                <div className={styles.checklistclass}>
                  <p>Checklist {`(${checklistobj.markedval}/${checklistobj.checklistarr.length})`}</p>
                  {
                    showchecklistobj.hasOwnProperty(checklistobj._id)?
                    <img src={uparrowimg} alt="" 
                    onClick={()=>handleremovekey(checklistobj._id)}
                    /> : 
                    <img src={downarrowimg} alt="" 
                    onClick={()=>handleaddkey(checklistobj._id, "todo")}
                    />
                  }
                </div>
                {
                  showchecklistobj.hasOwnProperty(checklistobj._id) &&
                  checklistobj.checklistarr.map((checklist, index) =>{
                    return(
                      <div className={styles.inputcheck}>
                        <input type="checkbox" 
                        checked={checklist.mark}
                        onClick={()=>updatemark(index, checklistobj._id)}
                        />
                        <input type="text" 
                        value={checklist.data}
                        />
                      </div>    
                    )
                  })
                }
                <div className={styles.datetype}>
                  {
                    checklistobj.duedate == "" && 
                    <button className={styles.notselected}></button>
                  }
                  {
                    checklistobj.year < currentyear &&
                    <button className={styles.selectedbtnred}>{checklistobj.duedatestring ? checklistobj.duedatestring : ""}</button>
                  }
                  {
                    checklistobj.year > currentyear &&
                    <button>{checklistobj.duedatestring ? checklistobj.duedatestring : ""}</button>
                  }                  
                  {
                    checklistobj.year == currentyear && checklistobj.month < currentmonth &&
                    <button className={styles.selectedbtnred}>{checklistobj.duedatestring ? checklistobj.duedatestring : ""}</button>
                  }                  
                  {
                    checklistobj.year == currentyear && checklistobj.month > currentmonth &&
                    <button>{checklistobj.duedatestring ? checklistobj.duedatestring : ""}</button>
                  }                  
                  {
                    checklistobj.year == currentyear && checklistobj.month == currentmonth &&
                    checklistobj.date < currendate &&
                    <button className={styles.selectedbtnred}>{checklistobj.duedatestring ? checklistobj.duedatestring : ""}</button>
                  }                  
                  {
                    checklistobj.year == currentyear && checklistobj.month == currentmonth &&
                    checklistobj.date >= currendate &&
                    <button>{checklistobj.duedatestring ? checklistobj.duedatestring : ""}</button>
                  }                  
                  <div>
                    <button onClick={()=>handlesectiontype("backlog", checklistobj._id)}>BACKLOG</button>
                    <button onClick={()=>handlesectiontype("inprogress", checklistobj._id)}>PROGRESS</button>
                    <button onClick={()=>handlesectiontype("done", checklistobj._id)}>DONE</button>
                  </div>
                </div>
              </div>    
              ):""
            })
          }
          </div>
        </div>
        <div className={styles.section}>
          <div className={styles.sectiontitlecollapse}>
            <p>In progress</p>
            <img src={collapseimg} alt="" 
            onClick={() => collapsechecklist("inprogress")}
            />
          </div>
          <div className={styles.sectioncardcontainer}>
          {
            allchecklist.map((checklistobj) =>{
              return(checklistobj.sectiontype=="inprogress")?(
                <div className={styles.sectioncard}>
                <div className={styles.priority}>
                  <div>
                    {
                      checklistobj.priority == "high" && <img src={Ellipseimg}/>
                    }
                    {
                      checklistobj.priority == "moderate" && <img src={Ellipse2img}/>
                    }
                    {
                      checklistobj.priority == "low" && <img src={Ellipse3img}/>
                    }
                    {
                      checklistobj.priority == "high" && <p>HIGH PRIORITY</p>
                    }
                    {
                      checklistobj.priority == "moderate" && <p>MODERATE PRIORITY</p>
                    }
                    {
                      checklistobj.priority == "low" && <p>LOW PRIORITY</p>
                    }
                  </div>
                  <div className={styles.threedotclass}
                    onClick={()=>closepopupfun(checklistobj._id)}
                  >
                    <img src={threedotimg} alt="" 
                    />
                  </div>
                  {
                    checklistobj._id == openpopup &&
                    <div className={styles.popupcard}>
                      <p
                      onClick={() => Editchecklist(checklistobj)}
                      >Edit</p>
                      <CopyToClipboard text={url + "/readonlychecklist/" + checklistobj._id}>
                        <p onClick={()=>handleshare(checklistobj._id)}>Share</p>
                      </CopyToClipboard>
                      <p
                      onClick={() => handledeletechecklist(checklistobj._id)}
                      >Delete</p>
                    </div>
                  }
                </div>
                <h2>{checklistobj.tempname}</h2>
                <div className={styles.checklistclass}>
                  <p>Checklist {`(${checklistobj.markedval}/${checklistobj.checklistarr.length})`}</p>
                  {
                    showchecklistobj.hasOwnProperty(checklistobj._id)?
                    <img src={uparrowimg} alt="" 
                    onClick={()=>handleremovekey(checklistobj._id)}
                    /> : 
                    <img src={downarrowimg} alt="" 
                    onClick={()=>handleaddkey(checklistobj._id, "inprogress")}
                    />
                  }
                </div>
                {
                  showchecklistobj.hasOwnProperty(checklistobj._id) &&
                  checklistobj.checklistarr.map((checklist, index) =>{
                    return(
                      <div className={styles.inputcheck}>
                        <input type="checkbox" 
                        checked={checklist.mark}
                        onClick={()=>updatemark(index, checklistobj._id)}
                        />
                        <input type="text" 
                        value={checklist.data}
                        />
                      </div>    
                    )
                  })
                }
                <div className={styles.datetype}>
                  {
                    checklistobj.duedate == "" && 
                    <button className={styles.notselected}></button>
                  }
                  {
                    checklistobj.year < currentyear &&
                    <button className={styles.selectedbtnred}>{checklistobj.duedatestring ? checklistobj.duedatestring : ""}</button>
                  }
                  {
                    checklistobj.year > currentyear &&
                    <button>{checklistobj.duedatestring ? checklistobj.duedatestring : ""}</button>
                  }                  
                  {
                    checklistobj.year == currentyear && checklistobj.month < currentmonth &&
                    <button className={styles.selectedbtnred}>{checklistobj.duedatestring ? checklistobj.duedatestring : ""}</button>
                  }                  
                  {
                    checklistobj.year == currentyear && checklistobj.month > currentmonth &&
                    <button>{checklistobj.duedatestring ? checklistobj.duedatestring : ""}</button>
                  }                  
                  {
                    checklistobj.year == currentyear && checklistobj.month == currentmonth &&
                    checklistobj.date < currendate &&
                    <button className={styles.selectedbtnred}>{checklistobj.duedatestring ? checklistobj.duedatestring : ""}</button>
                  }                  
                  {
                    checklistobj.year == currentyear && checklistobj.month == currentmonth &&
                    checklistobj.date >= currendate &&
                    <button>{checklistobj.duedatestring ? checklistobj.duedatestring : ""}</button>
                  }                  
                  <div>
                    <button onClick={()=>handlesectiontype("backlog", checklistobj._id)}>BACKLOG</button>
                    <button onClick={()=>handlesectiontype("todo", checklistobj._id)}>TO-DO</button>
                    <button onClick={()=>handlesectiontype("done", checklistobj._id)}>DONE</button>
                  </div>
                </div>
              </div>    
              ):""
            })
          }
          </div>
        </div>
        <div className={styles.section}>
          <div className={styles.sectiontitlecollapse}>
            <p>Done</p>
            <img src={collapseimg} alt="" 
            onClick={() => collapsechecklist("done")}
            />
          </div>
          <div className={styles.sectioncardcontainer}>
          {
            allchecklist.map((checklistobj) =>{              
              return(checklistobj.sectiontype == "done")?(
                <div className={styles.sectioncard}>
                <div className={styles.priority}>
                  <div>
                    {
                      checklistobj.priority == "high" && <img src={Ellipseimg}/>
                    }
                    {
                      checklistobj.priority == "moderate" && <img src={Ellipse2img}/>
                    }
                    {
                      checklistobj.priority == "low" && <img src={Ellipse3img}/>
                    }
                    {
                      checklistobj.priority == "high" && <p>HIGH PRIORITY</p>
                    }
                    {
                      checklistobj.priority == "moderate" && <p>MODERATE PRIORITY</p>
                    }
                    {
                      checklistobj.priority == "low" && <p>LOW PRIORITY</p>
                    }
                  </div>
                  <div className={styles.threedotclass}
                    onClick={()=>closepopupfun(checklistobj._id)}
                  >
                  <img src={threedotimg} alt="" 
                  />
                  </div>
                  {
                    checklistobj._id == openpopup &&
                    <div className={styles.popupcard}>
                      <p
                      onClick={() => Editchecklist(checklistobj)}
                      >Edit</p>
                      <CopyToClipboard text={url + "/readonlychecklist/" + checklistobj._id}>
                        <p onClick={()=>handleshare(checklistobj._id)}>Share</p>
                      </CopyToClipboard>
                      <p
                      onClick={() => handledeletechecklist(checklistobj._id)}
                      >Delete</p>
                    </div>
                  }
                </div>
                <h2>{checklistobj.tempname}</h2>
                <div className={styles.checklistclass}>
                  <p>Checklist {`(${checklistobj.markedval}/${checklistobj.checklistarr.length})`}</p>
                  {
                    showchecklistobj.hasOwnProperty(checklistobj._id)?
                    <img src={uparrowimg} alt="" 
                    onClick={()=>handleremovekey(checklistobj._id)}
                    /> : 
                    <img src={downarrowimg} alt="" 
                    onClick={()=>handleaddkey(checklistobj._id, "done")}
                    />
                  }
                </div>
                {
                  showchecklistobj.hasOwnProperty(checklistobj._id) &&
                  checklistobj.checklistarr.map((checklist, index) =>{
                    return(
                      <div className={styles.inputcheck}>
                        <input type="checkbox" 
                        checked={checklist.mark}
                        onClick={()=>updatemark(index, checklistobj._id)}
                        />
                        <input type="text" 
                        value={checklist.data}
                        />
                      </div>    
                    )
                  })
                }
                <div className={styles.datetype}>
                  {
                    checklistobj.duedate == "" && 
                    <button className={styles.notselected}></button>
                  }
                  {
                    checklistobj.duedate != "" &&
                    <button className={styles.selectedbtngreen}>{checklistobj.duedatestring}</button>
                  }
                  <div>
                    <button onClick={()=>handlesectiontype("backlog", checklistobj._id)}>BACKLOG</button>
                    <button onClick={()=>handlesectiontype("inprogress", checklistobj._id)}>PROGRESS</button>
                    <button onClick={()=>handlesectiontype("todo", checklistobj._id)}>TO-DO</button>
                  </div>
                </div>
                </div>    
              ):""
            })
          }
          </div>
        </div>
        </div>
      }
    </div>
    {
      deletecontainershow && <Delete
      setdeletecontainershow={setdeletecontainershow} checklistchanged={checklistchanged}
      setchecklistchanged={setchecklistchanged}
      />
    }
    {
      Createcardshow && <Createcard setCreatecardshow={setCreatecardshow}
      checklistchanged={checklistchanged} setchecklistchanged={setchecklistchanged}
      />
    }
    {
      copied &&
      <div className={styles.copied}>Link Copied</div>
    }
    </>
  )
}

export default Dashboard
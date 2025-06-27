
const { isLogin } = require("../middleware/isLogin");
const { isPremium } = require("../middleware/isPremium");
const Post = require("../models/post")
const User = require("../models/user");
const bcrypt = require("bcrypt")
const {validationResult} =require("express-validator");
const stripe = require("stripe")("sk_test_51OWwvuKpHWGUVeUqBzTwcOa0EUii8EDa48mZXnhwDZegcreYfQED0u1T8WzvXgHVfej3dnMEyvXBWtdiuWSMahdW00CP6fUUiO")
const postPerPage =6;
let totalPosts;
exports.renderProfile=(req,res)=>{
    const isLogin = req.session.isLogin ? true : false
    const page =+req.query.page || 1;
  Post.find({userId:req.user._id}).countDocuments().then((totalPost)=>{
        totalPosts=totalPost
        return Post.find({userId:req.user._id})
        .skip((page-1)*postPerPage)
        .limit(postPerPage)
        .populate("userId","username email isPremium payment_session_key")
        .sort({createdAt: -1})
    }).then((posts)=>{
        res.render("users/profile",{
            posts,
            user:req.user,
            csrfToken:req.csrfToken(),
            isLogin,
            isNext:(totalPosts>postPerPage*page) ? true : false,
            isPre:(page !== 1) ? true : false,
            nextPage:(totalPosts>page*postPerPage) ? page+1 : page,
            prePage:(page!==0) ? page-1 : page
        })
    }).catch(err=>console.log(err))

}
let atotal;
exports.renderPublicProfile=(req,res)=>{
    const {userId} = req.params;
   const isLogin = req.session.isLogin ? true : false
    const page =+req.query.page || 1;
  Post.find({userId}).countDocuments().then((totalPost)=>{
        atotal=totalPost
        return Post.find({userId})
        .skip((page-1)*postPerPage)
        .limit(postPerPage)
        .populate("userId","username email profile")
        .sort({createdAt: -1})
    }).then((posts)=>{
        res.render("users/publicProfile",{
            posts,
            user:req.user,
            csrfToken:req.csrfToken(),
            isLogin,
            isNext:(atotal>postPerPage*page) ? true : false,
            isPre:(page !== 1) ? true : false,
            nextPage:(atotal>page*postPerPage) ? page+1 : page,
            prePage:(page!==0) ? page-1 : page
        })
    }).catch(err=>console.log(err))

}

exports.renderEditInfo=(req,res)=>{

        res.render("users/editProfile",{
            user:req.user,
            csrfToken:req.csrfToken(),
            errorMsg:"",
            failFormData:{
                username:"",
                email:"",
                password:""
            }
        })
}

exports.updateProfile=async(req,res)=>{
    const {userId} = req.params;
    const {username,email,password} =req.body
    const error = validationResult(req)
    if(!error.isEmpty()){
        return res.status(422).render("users/editProfile",{
            user:req.user,
            csrfToken:req.csrfToken(),
            errorMsg:error.array()[0].msg,
            failFormData:{
                username,
                email,
                password
            }
        })
    }
    try{
        const user = await User.findById(userId)
       if(req.file){
        if(req.file && isPremium){
            user.profile = req.file.path
        }
       }
        if(username){
           if(username.length>3){
             user.username=username
           }else{
           req.flash("usernameErr","username have at least 3characters")
           return res.status(422).render("users/editProfile",{
            user:req.user,
            csrfToken:req.csrfToken(),
            errorMsg:req.flash("usernameErr"),
            failFormData:{
                username,
                email,
                password
            }
        })
    }
        }
        user.email = email

        if(password){
            if(password.length>4){
               user.password = await bcrypt.hash(password,10)
            }else{
            req.flash("passwordErr","password have at least 4")
            return res.status(422).render("users/editProfile",{
            user:req.user,
            csrfToken:req.csrfToken(),
            errorMsg:req.flash("usernameErr"),
            failFormData:{
                username,
                email,
                password
            }
        })
    }
        }
        await user.save()
        //rendering
        let totalPost;        
        Post.find({userId}).countDocuments().then(async(total)=>{
            totalPost=total
            const isLogin=req.session.isLogin ? true : false;
            const posts = await Post.find({userId})
            return res.render("users/profile",{
            posts,
            user:req.user,
            csrfToken:req.csrfToken(),
            isLogin,
            isNext:(totalPost>postPerPage*1) ? true : false,
            isPre:false,
            nextPage:(totalPost>1*postPerPage) ? 2 : 1,
            prePage:1
            })
        })
    }catch(err){
        console.log(err)
    }
}

exports.renderPremium=(req,res,next)=>{
    const isLogin = req.session.isLogin ? true : false;
    
    stripe.checkout.sessions.create({
        payment_method_types:['card'],
       line_items: [
      {
        price:"price_1Re9RFKpHWGUVeUqc3uCXJJq",
        quantity:1,
      },
  ],
        mode:'subscription',
        success_url:`${req.protocol}://${req.get("host")}/admin/subscription-success?session_id={CHECKOUT_SESSION_ID}`,//http://localhost:3000/admin/subscription-success
        cancel_url:`${req.protocol}://${req.get("host")}/admin/subscription-cancel`
    }).then((stripe_session)=>{
        return res.render("users/premium",{
        isLogin,
        csrfToken:req.csrfToken(),
        session_id:stripe_session.id,
    })
    }).catch((err)=>{
        const error = new Error("something wrong")
        console.log(err);
        
        next(error)
    })
  
}

exports.renderSuccess=async(req,res)=>{
    const {session_id} = req.query
    if(!session_id.includes("cs_test")){
        return res.redirect("profile")
    }
    try{
        const user =await User.findById(req.user._id)
    user.payment_session_key = session_id;
    user.isPremium=true;
    await user.save()

    return res.render("users/subscription_success",{
        isLogin:req.session.isLogin ? true : false,
        csrfToken:req.csrfToken(),
    })

    }catch(err){
        console.log(err);
        
    }
}

exports.premiumStatus=async(req,res)=>{
    const {payment_session_key} = req.params;
    const isLogin = req.session.isLogin ? true : false;
    try{
       const stripe_session =  await stripe.checkout.sessions.retrieve(payment_session_key)
    //    console.log(stripe_session);
       res.render("users/premiumStatus",{
        csrfToken:req.csrfToken(),
        isLogin,
        customerCountry:stripe_session.customer_details.address.country,
        customerEmail:stripe_session.customer_details.email,
        customerName:stripe_session.customer_details.name,
        postalCode:stripe_session.customer_details.address.postal_code,
        invoice_id:stripe_session.invoice,
        status:stripe_session.payment_status,
        customer:stripe_session.customer

       })
       
        
    }catch(err){
        console.log(err);
        
    }
}

exports.subscription_cancel=(req,res)=>{
     const isLogin = req.session.isLogin ? true : false
    const page =+req.query.page || 1;
  Post.find({userId:req.user._id}).countDocuments().then((totalPost)=>{
        totalPosts=totalPost
        return Post.find({userId:req.user._id})
        .skip((page-1)*postPerPage)
        .limit(postPerPage)
        .populate("userId","username email isPremium payment_session_key")
        .sort({createdAt: -1})
    }).then((posts)=>{
        res.render("users/profile",{
            posts,
            user:req.user,
            csrfToken:req.csrfToken(),
            isLogin,
            isNext:(totalPosts>postPerPage*page) ? true : false,
            isPre:(page !== 1) ? true : false,
            nextPage:(totalPosts>page*postPerPage) ? page+1 : page,
            prePage:(page!==0) ? page-1 : page
        })
    }).catch(err=>console.log(err))
}
const nodemailer = require('../config/nodemailer');

// module.exports = newCommentrs
exports.newComment = (comment)=>{
    let htmlString = nodemailer.renderTemplate({comment:comment},'/comments/new_comment.ejs')
    console.log(comment.user.name,comment.user.email);
    nodemailer.transporter.sendMail({
        from:'ayushbhatt2002@gmail.com',
        to:comment.user.email,
        subject:'New Comment Published',
        html: htmlString
    },(err,info)=>{
        if(err)
        {
            console.log('err in comment mail',err);
            return;
        }
        console.log("message sent",info);
        return;
    })
}
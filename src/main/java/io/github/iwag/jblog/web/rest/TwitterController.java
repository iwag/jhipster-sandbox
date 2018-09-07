package io.github.iwag.jblog.web.rest;


import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import io.github.iwag.jblog.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import org.springframework.web.servlet.view.RedirectView;
import twitter4j.Twitter;
import twitter4j.TwitterFactory;
import twitter4j.auth.AccessToken;
import twitter4j.auth.RequestToken;
import twitter4j.conf.Configuration;
import twitter4j.conf.ConfigurationBuilder;

import java.util.*;

@Controller
public class TwitterController {
    @Autowired
    UserService userService;

    private final Logger log = LoggerFactory.getLogger(TwitterController.class);

    @RequestMapping("/twitterCallback")
    public String twitterCallback(@RequestParam(value="oauth_verifier", required=false) String oauthVerifier,
                                  @RequestParam(value="denied", required=false) String denied,
                                  HttpServletRequest request, HttpServletResponse response, Model model) {

        if (denied != null) {
            //if we get here, the user didn't authorize the app
            return "redirect:/";
        }

        //get the objects from the session
        Twitter twitter = (Twitter) request.getSession().getAttribute("twitter");
        RequestToken requestToken = (RequestToken) request.getSession().getAttribute("requestToken");

        try {
            //get the access token
            AccessToken token = twitter.getOAuthAccessToken(requestToken, oauthVerifier);

            Map<String, Object> details = new HashMap<>();
            twitter4j.User twitterUser = twitter.showUser(twitter.getId());

            details.put("picture", twitterUser.getMiniProfileImageURL());
            details.put("langKey", twitterUser.getLang());
            details.put("preferred_username", twitterUser.getScreenName());
            details.put("sub", twitter.getId());
            details.put("email", twitterUser.getScreenName() + "@example.com");

            userService.getUserFromAuthentication(details);

            //take the request token out of the session
            request.getSession().removeAttribute("requestToken");

            //store the user name so we can display it on the web page
            model.addAttribute("username", twitter.getScreenName());

            log.info("twitter=" + twitter.getScreenName() + "," + twitter.getId() + ":", twitter.toString());


            return "redirect:/";
        } catch (Exception e) {
            log.error("Problem getting token!",e);
            return "redirect:/";
        }
    }

    public Twitter getTwitter() {
        Twitter twitter = null;

        //set the consumer key and secret for our app
        String consumerKey = "-";
        String consumerSecret = "-";

        //build the configuration
        ConfigurationBuilder builder = new ConfigurationBuilder();
        builder.setOAuthConsumerKey(consumerKey);
        builder.setOAuthConsumerSecret(consumerSecret);
        Configuration configuration = builder.build();

        //instantiate the Twitter object with the configuration
        TwitterFactory factory = new TwitterFactory(configuration);
        twitter = factory.getInstance();

        return twitter;
    }

    @RequestMapping("/twitter/login")
    public RedirectView getToken(HttpServletRequest request, Model model) {
        //this will be the URL that we take the user to
        String twitterUrl = "";

        try {
            //get the Twitter object
            Twitter twitter = getTwitter();

            //get the callback url so they get back here
            String callbackUrl = "http://127.0.0.1:8080/twitterCallback";

            //go get the request token from Twitter
            RequestToken requestToken = twitter.getOAuthRequestToken(callbackUrl);

            //put the token in the session because we'll need it later
            request.getSession().setAttribute("requestToken", requestToken);

            //let's put Twitter in the session as well
            request.getSession().setAttribute("twitter", twitter);

            //now get the authorization URL from the token
            twitterUrl = requestToken.getAuthorizationURL();

            log.info("Authorization url is " + twitterUrl);
        } catch (Exception e) {
            log.error("Problem logging in with Twitter!", e);
        }

        //redirect to the Twitter URL
        RedirectView redirectView = new RedirectView();
        redirectView.setUrl(twitterUrl);
        return redirectView;
    }
}

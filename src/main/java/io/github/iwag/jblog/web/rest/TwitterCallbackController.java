package io.github.iwag.jblog.web.rest;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import io.github.iwag.jblog.domain.Authority;
import io.github.iwag.jblog.domain.User;
import io.github.iwag.jblog.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.security.oauth2.provider.OAuth2Request;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import twitter4j.Twitter;
import twitter4j.auth.AccessToken;
import twitter4j.auth.OAuthAuthorization;
import twitter4j.auth.RequestToken;

import java.util.*;
import java.util.stream.Collectors;

@Controller
public class TwitterCallbackController {

    @Autowired
    UserService userService;

    private final Logger log = LoggerFactory.getLogger(TwitterTokenController.class);

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

            SecurityContext securityContext = SecurityContextHolder.getContext();

            log.info("token=" + token.toString());

            Map<String, Object> details = new HashMap<>();
            twitter4j.User twitterUser = twitter.showUser(twitter.getId());

            details.put("picture", twitterUser.getMiniProfileImageURL());
            details.put("langKey", twitterUser.getLang());
            details.put("preferred_username", twitterUser.getScreenName());
            details.put("sub", Long.toString(twitter.getId()));
            details.put("email", twitterUser.getScreenName() + "@example.com");

            userService.getUserFromAuthentication(details);

            request.getSession().setAttribute("access-token", token.toString());

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
}

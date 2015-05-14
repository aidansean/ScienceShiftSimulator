from project_module import project_object, image_object, link_object, challenge_object

p = project_object('ScienceShiftSimulator', 'Science Shift Simulator')
p.domain = 'http://www.aidansean.com/'
p.path = 'SSS'
p.preview_image_ = image_object('http://placekitten.com.s3.amazonaws.com/homepage-samples/408/287.jpg', 408, 287)
p.folder_name = 'LHCGames'
p.github_repo_name = 'SSS'
p.mathjax = True
p.links.append(link_object(p.domain, p.path, 'Live page'))

p.introduction = 'The Science Shift Simulator game is something that emerged from development of the <a href="">aDetector</a> project and <a href="">LHC Driver</a> projects.  The mechanic is loosely based on the cooperative game <a href="">Space Team</a>.  This is still in development, so the current page doesn\'t actually work at the time of writing, and development will continue over the net week and months.'
p.overview = '''This is a cooperative multiplayer game aimed at showing the public (especially high school pupils) how particle physics research actually takes place, place an emphasis on cooperation.  The game proceeds by bringing up several issues that need to be solved.  The "Shift Leader" has information about how to solve the problems, but no control over the various subsystems.  Instead they have a team of "Shifters" whose job is to solve the problems.  This then becomes a problem of communication, cooperation, and optimisation between the various players.

For this project each player has control of a browser, which communicates with a central server.  The Shift Leader's client sends problems to the server, which are then collected by the Shifters' clients.  As a result the main difficulty in developing this game is synchronisation, especially when there are network problems!

Eventually this project will be reskinnable to allow other developers to add their own content.'''

p.challenges.append(challenge_object('The big problem is synchronisation.', 'This is not the first project I\'ve developed that required the client and server to communicate via AJAX requests, but it is the first that had more than one client sending information to the server.  In fact it was this project that persuaded me to install MySQL locally and hook it up to Apache to get a local LAMP stack running on the my laptop.  I got a prototype version working for demonstration purposes, but had to cut some corners.  Development stopped in the middle of a significant rewriting of code, which is still to be completed.', 'To be revisited.'))

p.challenges.append(challenge_object('This game contains many mini games.', 'This is the first game I made that has mini games in it, and this required a different strategy for development.  Making a generic mini game module in Javascript is not easy, and there will be some further significant changes as I rewrite this code again.', 'Resolved, to be revisited.'))

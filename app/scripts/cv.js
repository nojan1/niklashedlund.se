$(document).ready(function(){
    var skills = [
        {text: 'PHP', weight: 1 },
        {text: 'Arch Linux', weight: 1 },
        {text: 'Debian', weight: 1 },
        {text: 'Python', weight: 1 },
        {text: 'Bash', weight: 1 },
        {text: 'Cisco IOS', weight: 1 },
        {text: 'Nätverk', weight: 1 },
        {text: 'Mysql', weight: 1 },
        {text: 'Windows', weight: 1 },
        {text: '.NET', weight: 1 },
        {text: 'C#', weight: 1 },
        {text: 'Java', weight: 1 },
        {text: 'C / C++', weight: 1 },				
        {text: 'Android', weight: 1 },
        {text: 'HTML', weight: 1 },
        {text: 'Javascript', weight: 1 },
        {text: 'CSS', weight: 1 },
        {text: 'Photoshop', weight: 1 },
        {text: 'Angular JS', weight: 1 },
        {text: 'Gulp', weight: 1 },
        {text: 'Blender', weight: 1 },
        {text: 'WCF', weight: 1 },
        {text: 'WPF', weight: 1 },
        {text: 'After effects', weight: 1 },
        {text: 'Premiere', weight: 1 },
        {text: 'AVR', weight: 1 },
        {text: 'Arduino', weight: 1 },
    ];

    $('#skill-cloud').jQCloud(skills);
});
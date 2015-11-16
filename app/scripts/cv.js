$(document).ready(function(){
    var skills = [
        {text: 'PHP', weight: 4 },
        {text: 'Arch Linux', weight: 5 },
        {text: 'Debian', weight: 2 },
        {text: 'Python', weight: 7 },
        {text: 'Bash', weight: 6 },
        {text: 'Cisco IOS', weight: 5 },
        {text: 'Nätverk', weight: 7 },
        {text: 'Mysql', weight: 6 },
        {text: 'Windows', weight: 7 },
        {text: '.NET', weight: 8 },
        {text: 'C#', weight: 8 },
        {text: 'Java', weight: 2 },
        {text: 'C / C++', weight: 3 },				
        {text: 'Android', weight: 1 },
        {text: 'HTML', weight: 8 },
        {text: 'Javascript', weight: 7 },
        {text: 'CSS', weight: 8 },
        {text: 'Photoshop', weight: 6 },
        {text: 'Angular JS', weight: 7 },
        {text: 'Gulp', weight: 4 },
        {text: 'Blender', weight: 5 },
        {text: 'WCF', weight: 4 },
        {text: 'WPF', weight: 6 },
        {text: 'After effects', weight: 1 },
        {text: 'Premiere', weight: 2 },
        {text: 'AVR', weight: 5 },
        {text: 'Arduino', weight: 4 },
    ];

    $('#skill-cloud').jQCloud(skills, {
        autoResize: true,
        shape: 'rectangular'
    });
});
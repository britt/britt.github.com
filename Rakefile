begin
  require 'rubygems'
  require 'bundler'
rescue LoadError
  raise "Could not load the bundler gem. Install it with `gem install bundler`."
end

task :default => :server
 
desc 'Build site with Jekyll'
task :build do
  jekyll
end
 
desc 'Build and start server with --auto'
task :server do
  jekyll '--server --auto'
end

desc 'Build and deploy'
task :deploy do
  sh 'rm -rf /tmp/_site'
  jekyll '/tmp/_site', false
  sh 'rm -rf /tmp/brittcrawford.com.deploy'
  sh 'git clone git@github.com:britt/britt.github.com.git /tmp/brittcrawford.com.deploy'
  sh 'cd /tmp/brittcrawford.com.deploy/ && git rm -rf assets/* && git commit -a -m "DEPLOY: Cleaning generated assets"'
  sh 'cp -r /tmp/_site/* /tmp/brittcrawford.com.deploy/'
  sh "cd /tmp/brittcrawford.com.deploy/ && git add . && git commit -a -m \"DEPLOY #{Time.now.strftime('%m-%e-%y %H:%M')}\" && git push origin master"
  puts "Deployment successful"
end

desc 'Create a new post'
task :post, [:title] do |t, args|
  title = args.title
  file_name = File.join('_posts', post_file_name(title, Time.now))
  File.open(file_name, 'w+') { |f| f.write(front_matter(title))}
  puts "Created #{file_name}"
end

def jekyll(opts = '', clean = true)
  sh 'rm -rf _site' if clean
  sh 'jekyll ' + opts
end

def post_file_name(title, pub_date)
  [pub_date.year, pub_date.month, pub_date.day, title.downcase.gsub(/\s+/,'-')].join('-') + '.md'
end

def front_matter(title)
  text = <<-FRONT_MATTER
---
layout: post
title: #{title}
---
  FRONT_MATTER
end
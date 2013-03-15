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
task :deploy => :build do
  sh 'rsync -rtzh --progress --delete _site/ tatey@tatey.com:~/var/www/tatey.com/'
end

desc 'Create a new post'
task :post, [:title] do |t, args|
  title = args.title
  file_name = File.join('_posts', post_file_name(title, Time.now))
  File.open(file_name, 'w+') { |f| f.write(front_matter(title))}
  puts "Created #{file_name}"
end

def jekyll(opts = '')
  sh 'rm -rf _site'
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
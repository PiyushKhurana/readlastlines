#!/usr/bin/python
import random, time

filename = "access_logs"

def main():
    count=1
    sentences = ['Lorem ipsum dolor sit amet consectetur, adipisicing elit.', 'Consectetur accusamus quo hic!', 'Necessitatibus fugiat eveniet repellat magni dolore sit ducimus?']
    while count<190:
        if True:
            
            with open(filename, 'a') as logfile:
                s = "[" + time.asctime(time.localtime()) + "] "
                s += str(count)
                s += sentences[random.randint(0,2)]
                s += '\n'
                count=count+1
                logfile.write(s)
        time.sleep(3)
if __name__ == "__main__":
    main()
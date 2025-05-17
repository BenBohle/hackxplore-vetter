#include <unistd.h>
#include <signal.h>
#include <stdlib.h>

int main(int argc, char **argv)
{
	int		i;
	pid_t	server_pid;
	
	server_pid = atol(argv[1]);
	i = -1;
	while (1)
	{
		sleep(1);
		if (++i % 2 == 0)
			kill(server_pid, SIGUSR1);
		else
			kill(server_pid, SIGUSR2);
		if(i == 6)
		{
			write(2,"Error: server utility sending the signals is currentlly down",60);
			exit(EXIT_FAILURE);
		}
	}
	
}
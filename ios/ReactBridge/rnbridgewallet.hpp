
#pragma once

#include <string>

namespace RNCPP {
	void init_library(std::string, std::string url);
	std::string invoke_cpp_method(std::string method, std::string json_param);
}
